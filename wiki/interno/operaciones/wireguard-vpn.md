---
tags: [forjado, operaciones, infraestructura, vpn, wireguard]
tipo: proceso
estado: activo
creado: 2026-10-29
actualizado: 2026-10-29
---

# WireGuard VPN (wg-easy) — FORJADO

Servicio de red privada virtual (VPN) desplegado sobre el VPS principal de Oracle Cloud (`129.213.108.102`) mediante Dokploy (`wg-easy:15`). Permite crear túneles cifrados seguros de alta velocidad para conectar estaciones de trabajo, agentes y dispositivos a la infraestructura interna sin exponer puertos sensibles a internet.

---

## 1. Arquitectura y Puertos

| Componente | Protocolo / Puerto | Acceso | Propósito |
|---|---|---|---|
| **Tráfico VPN** | UDP `51820` | Directo Host (OCI Security List) | Conexión y túnel de clientes WireGuard |
| **Panel Web UI** | TCP `51821` | HTTPS vía Traefik (`sslip.io`) | Administración de clientes, llaves y QR |
| **Subred Interna** | IPv4 `10.8.0.0/24` | Interno túnel | IPs asignadas a los peers / clientes |

Fuente histórica de despliegue y auditoría en [[../../../raw/interno/2026-10-29-instalacion-y-puesta-a-punto-wireguard-dokploy|raw: 2026-10-29-instalacion-y-puesta-a-punto-wireguard-dokploy]].

---

## 2. Accesos a la Administración

* **URL de acceso**: `https://forjado-wgeasy-0d8d22-129-213-108-102.sslip.io`
* **Credenciales centralizadas**: Registradas en [[Credenciales]].

---

## 3. Clientes y Perfiles Sincronizados

### Perfil Principal en Producción (Hostinger / Alta Velocidad)
* **Archivo en la bóveda**: `[[../../../raw/misc/Jorge-pc.conf|Jorge-pc.conf]]`
* **Servidor**: Hostinger US (`31.220.62.26:51820`), IP asignada `10.8.0.3`.
* **Uso actual**: Conexión activa en la PC de desarrollo de Jorge. Rendimiento y ancho de banda óptimos para navegación y trabajo diario.

### Perfil Servidor Propio Optimizado (VPS Oracle Cloud / Dokploy)
* **Archivo en la bóveda**: `[[../../../raw/misc/forjado-wireguard.conf|forjado-wireguard.conf]]`
* **Servidor**: Oracle Cloud Ashburn (`129.213.108.102:51820`), IP asignada `10.8.0.2`.
* **Estado**: **100% Operativo y Alta Velocidad**.
* **Optimizaciones aplicadas y persistidas en `/etc/wireguard/wg0.conf`**:
  - Enrutamiento Dokploy multi-red corregido: MASQUERADE universal sobre `! -o wg0` (soluciona la salida por `eth2` que descartaba paquetes de vuelta).
  - DNS purgado de IPv6: fijado en `1.1.1.1, 8.8.8.8` (elimina el retraso de 3-5 s por timeout).
  - MTU ajustado a `1360` (elimina la fragmentación de paquetes en la red OCI).
  - TCP MSS Clamping activo en kernel (`TCPMSS clamp to PMTU`).

---

## 4. Cómo Conectar un Nuevo Dispositivo

1. Instalar la app oficial de WireGuard ([Windows](https://www.wireguard.com/install/), Android o iOS).
2. Para PC: importar el archivo `.conf` generado y activar.
3. Para móviles: ingresar al panel web, presionar el ícono de código QR del cliente y escanear desde la app móvil.

---

## Relacionado
- [[Herramientas y Stack]]
- [[Credenciales]]
- [[Estado del Proyecto]]
