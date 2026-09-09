---
tags: [forjado, carwarriors, manychat, instagram, configuracion]
tipo: referencia
estado: activo
actualizado: 2026-09-09
fuente_raw: raw/clientes/carwarriors-llc/2026-09-09-fix-bson-inventario-rances-y-dedupe-leads.md
---

# ManyChat — Carwarriors LLC: inventario completo de configuración

> [!info]
> Auditoría real hecha el 2026-09-09 conectando por CDP al Chrome de Jorge (logueado como Administrador de la cuenta ManyChat). Snapshot del estado tal cual estaba configurado ese día — no es un histórico, actualizar esta página si algo cambia. Detalle narrativo completo en [[../../raw/clientes/carwarriors-llc/2026-09-09-fix-bson-inventario-rances-y-dedupe-leads|raw/2026-09-09]].

## Cuenta

- Página: **Carwarriors LLC | Car Dealer** (Facebook Page ID `4391897`, URL base `app.manychat.com/fb4391897/`).
- Plan: **TRIAL** (premium trial).
- Zona horaria de la cuenta: **(UTC-04:00) Eastern Time — New York**.
- **Propietario:** "booxter marketing" (tercero, no Jorge ni Carwarriors directamente — relevante para billing/continuidad de acceso).
- **Administrador:** Jorge (cuenta usada para esta auditoría).
- No hay Clave de API generada (`Configuración → API`) — la integración con n8n es unidireccional: ManyChat llama *hacia afuera* a un webhook de n8n (`Solicitud externa`), n8n nunca llama hacia la API de ManyChat.

## Canales conectados

| Canal | Estado |
|---|---|
| **Instagram** | ✅ Conectado — `@carwarriorsllc` |
| WhatsApp | ❌ No conectado en ManyChat (botón "Conectar") |
| Messenger | ❌ No conectado |
| SMS | ❌ No conectado |
| TikTok | ❌ No conectado |
| Telegram | ❌ No conectado |
| Correo electrónico | ❌ No conectado |

**Confirma lo ya documentado:** ManyChat en esta cuenta solo se usa activamente para Instagram. WhatsApp/Messenger reales del negocio corren por GHL directamente, no por ManyChat (coincide con la nota "ManyChat legacy, solo redirige tráfico" ya existente en [[carwarriors-llc]]).

## Automatizaciones básicas (Instagram → Configuración de canal)

Configuradas dentro de Instagram → herramientas nativas de ManyChat (no flujos de la carpeta FORJADO):

| Herramienta | Estado |
|---|---|
| Saluda a los nuevos seguidores (BETA, vía API oficial de Meta) | 🟢 En vivo |
| Respuesta predeterminada (vincula al flujo "Instagram Default Reply") | 🟡 Pausado |
| Menú principal | ⚪ No configurado |
| Introductores de conversación | ⚪ No configurado |
| Respuesta a mención en una historia | ⚪ No configurado |
| Automatización de aceptación de ingreso/salida ("Comenzar"/"Detener") | Palabras clave de sistema, no editables — activas por defecto |
| API de conversiones de Meta (optimización de anuncios) | ❌ No conectada |

## Manychat AI nativa (IA de Manychat, BETA para Instagram)

**0 de 2 pasos completados** — no activada:
- "Activar Comentarios de IA" — no hecho.
- "Comunica tus objetivos a IA" — no hecho.

Confirma la decisión ya documentada de no usar la IA nativa de comentarios de ManyChat (no expone su clasificación como variable usable en Condición) y en su lugar clasificar `es_interes_real`/`idioma` vía n8n + OpenRouter.

## Secuencias

Ninguna configurada (sección vacía).

## Flujos (Automatización → Mis automatizaciones)

### Raíz (fuera de cualquier carpeta)

| Flujo | Estado | Ejecuciones | CTR | Trigger |
|---|---|---|---|---|
| Turn story replies into leads | 🟢 LIVE | 4 | 75% | Responde en Historia específica + mensaje contiene "REGALO" |
| Saludá a tus nuevos seguidores | 🟢 LIVE | 371 | 25.7% | (vinculado a la herramienta básica de nuevos seguidores) |
| Auto-DM de links desde comentarios | 🟢 LIVE | 0 | n/a | Comenta en Publicación o Reel específicos |
| Envía links automáticos por DM | ⚪ DRAFT | n/a | n/a | Mensaje contiene "viralES" |
| Autoenviar enlaces desde comentarios, historias o DMs | 🔴 STOPPED | 0 | n/a | Mensaje contiene precio/auto/suv/troca/camioneta/pickup/"0 down"/"trade in" |
| Instagram Default Reply | 🔴 STOPPED | 0 | n/a | (vinculado a Respuesta predeterminada, pausada) |

### Carpeta `FORJADO` (los flujos que construimos para el proyecto)

| Flujo | Estado | Ejecuciones | Trigger |
|---|---|---|---|
| **Respuesta Comentarios** | 🔴 **STOPPED**, disparador **Deshabilitado** | 0 (Envíos, Contactos únicos, Correos, Teléfonos) | "El usuario comenta en cualquier publicación o reel" — creado 2026-08-28, modificado ≈2026-09-02 |

**Cableado de "Respuesta Comentarios" (confirmado visualmente en el editor):**
`Cuando comenta (Post or Reel Comments #3)` → `Acciones: Solicitud externa` (webhook a n8n, `COMENTARIOS-MANYCHAT`) → `Condición: es_interes_real es verdadero` → `Instagram: Enviar mensaje (respuesta_dm)`.

⚠️ **Este es el flujo real detrás del pendiente "comentarios IG/FB sin tráfico"** — ver [[carwarriors-llc]] para el pendiente activo (decidir con Jorge/Bianca si se reactiva).

## Campos de usuario (Custom User Fields)

Solo 3, todos creados específicamente para "Respuesta Comentarios" — confirma que es una integración limpia, sin campos huérfanos de pruebas viejas:

| Nombre | Tipo |
|---|---|
| `es_interes_real` | Boolean |
| `respuesta_dm` | Text |
| `respuesta_publica` | Text |

Sin campos de bot adicionales ni campos archivados.

## Etiquetas (Tags)

4 etiquetas, todas auto-generadas por flujos existentes (para segmentar contactos que pasaron por cada uno):
- `2025-04-24 EB story reply multi links`
- `Auto-DM de links desde comentarios`
- `Autoenviar enlaces desde comentarios, historias o DMs`
- `Saludá a tus nuevos seguidores`

## Integraciones nativas del marketplace de ManyChat

Ninguna conectada — ActiveCampaign, MailChimp, HubSpot CRM y Kit aparecen todas en "Paso 1: Conectar..." (no configuradas). GHL no aparece como integración nativa de ManyChat porque la conexión real es vía el webhook de n8n, no vía el marketplace.

## Equipo

- Propietario: booxter marketing (facturación)
- Administrador: Jorge

## Relacionado

- [[carwarriors-llc|Carwarriors LLC]]
- [[../../raw/clientes/carwarriors-llc/2026-09-09-fix-bson-inventario-rances-y-dedupe-leads|raw/2026-09-09 — auditoría completa]]
- [[../../raw/clientes/carwarriors-llc/2026-09-05-comentarios-ig-fb-auditoria-n8n-sano-sin-trafico-real|raw/2026-09-05 — auditoría del lado n8n]]
