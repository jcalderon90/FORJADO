---
tags: [forjado, recurso, credenciales]
tipo: recurso
estado: activo
creado: 2026-06-17
actualizado: 2026-11-21
---

# Credenciales — FORJADO

> [!warning] Seguridad
> **Las contraseñas, tokens y archivos `.conf` viven exclusivamente en la bóveda privada de Obsidian (`BOVEDA-PERSONAL`), nunca en Git.** Este documento sirve solo como índice de referencias hacia los servicios de infraestructura.

## Cuentas del negocio

| Servicio | Cuenta / Referencia | Ubicación de acceso en Obsidian |
|---|---|---|
| Correo | `jcalderon900610@gmail.com` | `FORJADO/API - Cuenta Personal` |
| Dominio / Hosting | — | `FORJADO/ORACLE - VPS/` |

## Infraestructura y Red

| Servicio | URL / Host | Usuario | Credencial / Archivo en Obsidian | Notas |
|---|---|---|---|---|
| **WireGuard UI (wg-easy)** | `https://forjado-wgeasy-0d8d22-129-213-108-102.sslip.io` | `admin` | `FORJADO/ORACLE - VPS/WireGuard UI` (`Jorge-pc.conf`, `forjado-wireguard.conf`) | Puerto VPN UDP `51820`. Ver [[../operaciones/wireguard-vpn|WireGuard VPN]]. |
| **Dokploy** | `http://129.213.108.102:3000` | `jcalderon900610@gmail.com` | `FORJADO/ORACLE - VPS/APPS y CREDENCIALES` | Panel de despliegue en VPS OCI. |

## Bases de datos
- [[mongodb-database|MongoDB Database]] (credenciales en Obsidian: `FORJADO/MongoDB Database`)

## Accesos de clientes
> Los accesos y credenciales de clientes se guardan exclusivamente en la bóveda de Obsidian (`FORJADO/<Cliente>/`), nunca en el repositorio Git.

## Relacionado
- [[../operaciones/herramientas-y-stack|Herramientas y Stack]]
- [[../operaciones/wireguard-vpn|WireGuard VPN]]
