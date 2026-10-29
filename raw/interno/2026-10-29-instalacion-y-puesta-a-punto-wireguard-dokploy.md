---
tags: [forjado, interno, infraestructura, wireguard, dokploy, vpn, oracle-cloud]
tipo: raw
fecha: 2026-10-29
---

# Instalación, Auditoría y Puesta a Punto de WireGuard (wg-easy) en Dokploy / Oracle Cloud

## Contexto
Se requirió la revisión, auditoría y puesta en marcha definitiva de un nuevo servicio de VPN (`wg-easy`) instalado sobre la instancia de **Dokploy** corriendo en el VPS principal de Oracle Cloud Infrastructure (Ashburn, IP pública `129.213.108.102`), asegurando que quedara 100% operativo tanto a nivel de contenedor/kernel, interfaz web, y reglas de firewall en Oracle Cloud.

## Acciones realizadas

### 1. Inspección del despliegue en Dokploy
- **Servicio**: `wg-easy` (ID interno: `forjado-wgeasy-jy6izv`), tipo Compose.
- **Imagen**: `ghcr.io/wg-easy/wg-easy:15`.
- **Configuración Compose auditada**:
  - `ports`: `"51820:51820/udp"` publicado directamente al host para el tráfico VPN.
  - `expose`: `51821` para la interfaz web a través de Traefik.
  - `cap_add`: `NET_ADMIN`, `SYS_MODULE`, `NET_RAW`.
  - `sysctls`:
    - `net.ipv4.ip_forward=1`
    - `net.ipv4.conf.all.src_valid_mark=1`
    - `net.ipv6.conf.all.disable_ipv6=0`
    - `net.ipv6.conf.all.forwarding=1`
    - `net.ipv6.conf.default.forwarding=1`
  - Variables de entorno cargadas:
    - `WIREGUARD_HOST=forjado-wgeasy-0d8d22-129-213-108-102.sslip.io`
    - `INIT_PORT=51820`
    - `INIT_USERNAME=admin`
    - `INIT_PASSWORD=yjwrbdhmj7eanleqyrfai9hyemczkavs`
    - `INIT_DNS=1.1.1.1,8.8.8.8`
    - `PORT=51821`

### 2. Activación del dominio y certificado SSL
- En la pestaña **Domains** de Dokploy, se activó el switch del dominio `forjado-wgeasy-0d8d22-129-213-108-102.sslip.io` enrutado al puerto `51821` con HTTPS y certificado Let's Encrypt.
- Verificación HTTP: Responde `302 Found` redirigiendo a `/login` bajo HTTPS con certificado válido.

### 3. Comprobación interna en el contenedor (Terminal Docker)
Se abrió sesión interactiva dentro del contenedor `forjado-wgeasy-jy6izv-wg-easy-1`:
- `wg show`: Interfaz `wg0` activa y escuchando en el puerto `51820/udp`, con par de claves y peer `forjado` configurado.
- `iptables -t nat -L POSTROUTING -n -v`: Regla activa `MASQUERADE all -- * eth0 10.8.0.0/24 0.0.0.0/0`.
- `/proc/sys/net/ipv4/ip_forward`: Valor verificado en `1`.
- Conectividad a internet: `ping -c 2 1.1.1.1` ejecutado con éxito (0% de pérdida de paquetes, round-trip ~0.94 ms).

### 4. Auditoría de red en Oracle Cloud Infrastructure (OCI)
Se ingresó a la consola de OCI (`jcarrasco96`, región `us-ashburn-1`):
- Se inspeccionó la VCN `VCN-SERVIDOR` y su `Default Security List for VCN-SERVIDOR`.
- Se verificó la existencia y validez de las siguientes Ingress Rules:
  - **UDP 51820** (`0.0.0.0/0`) — WireGuard VPN.
  - **TCP 51821** (`0.0.0.0/0`) — WireGuard Web UI.

### 5. Generación de perfil y archivo de configuración cliente
- Perfil creado en la Web UI: **`forjado`** con IP interna asignada `10.8.0.2`.
- Archivo exportado y guardado localmente en la máquina Windows del usuario (`C:\Users\Jorge\Downloads\forjado.conf`).
- Respaldo persistente guardado en la bóveda de Obsidian: `raw/misc/forjado-wireguard.conf` con `PersistentKeepalive = 25` para sincronización en la nube.

## Accesos resultantes
- **Panel Web WireGuard**: `https://forjado-wgeasy-0d8d22-129-213-108-102.sslip.io`
- **Usuario**: `admin`
- **Contraseña**: `yjwrbdhmj7eanleqyrfai9hyemczkavs`
- **Endpoint VPN**: `129.213.108.102:51820`


## Cierre y ajuste de cliente activo (2026-10-29)
- **Pruebas de cliente**: Jorge instaló la aplicación oficial de WireGuard en Windows y probó el perfil `forjado.conf`. La navegación resultó muy lenta debido a la latencia/timeout del DNS IPv6 de Cloudflare (`2606:4700:4700::1111`) en el túnel de OCI y MTU sin clamp-mss.
- **Configuración adoptada en producción**: Se cargó el perfil de alta velocidad `Jorge-pc.conf` proveniente de un VPS Hostinger US (`31.220.62.26:51820`, peer `10.8.0.3`), el cual ofrece rendimiento inmediato y navegación fluida.
- **Sincronización en la nube**: Se respaldó `Jorge-pc.conf` en la bóveda de Obsidian (`raw/misc/Jorge-pc.conf`) para persistencia y sincronización multi-dispositivo.

- **Resolución definitiva de velocidad en el VPS propio (Oracle Cloud)**: Se identificó que Dokploy conecta el contenedor a múltiples redes donde la interfaz de salida a internet es `eth2` (`default via 172.17.5.1 dev eth2`), mientras la regla por defecto de wg-easy apuntaba exclusivamente a `eth0`. Al salir por `eth2` sin MASQUERADE, Oracle Cloud descartaba los paquetes de vuelta (evidenciado por `124 B received, 34.36 KiB sent` en la app del cliente). Se aplicó en caliente y se persistió en `/etc/wireguard/wg0.conf` la regla universal `iptables -t nat -A POSTROUTING -s 10.8.0.0/24 ! -o wg0 -j MASQUERADE` junto con `TCPMSS clamp-mss-to-pmtu`. Tras reiniciar el túnel `forjado`, la velocidad y transferencia quedaron 100% operativas y fluidas.
