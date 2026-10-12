---
tags: [forjado, cliente, varela-law, slack, n8n, notificaciones]
tipo: raw
cliente: Varela Law
fecha: 2026-10-12
---

# Slack: canales `#reportes` y `#notificaciones` — plan y estado

Idea de Jorge (2026-10-12): crear un canal en Slack para reportes y notificaciones, o uno para reportes y otro para notificaciones. **Decisión (recomendación aceptada por Jorge): dos canales privados** y errores técnicos fuera de los canales del cliente.

## Plan

| Canal | Contenido |
|---|---|
| `#reportes` (privado) | Reporte semanal de facturas vencidas (lunes), agenda de deadlines (7:00 AM), borrador de avisos de facturas (8:30 AM) |
| `#notificaciones` (privado) | Zelle registrado o con revisión manual, contrato firmado procesado, lead nuevo / SMS de Texto |
| Errores técnicos | No van a los canales del cliente: siguen por el `ERROR HANDLER` al correo de Jorge (o un canal privado solo suyo) |

- Privados porque los reportes traen nombres de clientes, casos y montos.
- Mantener el correo a Mario al principio y publicar en Slack además; quitar el correo cuando Mario confirme que prefiere Slack.
- Avisar a Mario antes de invitarlo (es el dueño del espacio): crear los canales no es visible para el equipo, invitar sí.

## Reconocimiento del Slack de Varela Law (2026-10-12, solo lectura, con un workflow temporal ya archivado)

- Credenciales de Slack en n8n: **`Slack account` (OAuth2) está revocada** (`token_revoked`). **`Contract-Bot API` (OAuth2) funciona** (la usa el flujo de contratos). Hay otras (`Slack Access Token Account`, `VICTORIA`, `Slack Contract-Bot Bearer Auth account`) sin probar.
- Espacio de trabajo: ~30 personas activas (21–22 en `#general`/`#new-contracts`). Mario Varela (`mvarela`, `U04BK6L9C72`) es owner/admin. Rosa: `U0BB5SYRU84`. Adalberto Lopez: `U04Q7RN1ETD`. Bot del flujo de contratos: `contractbot` (`U09G324E8H2`).
- 16 canales visibles, **todos públicos**: `general`, `whatsapp-business`, `bond-cases`, `new-contracts` (donde ya caen los contratos), `mensajes`, `immigration`, `inmigracion-revisar`, `transactional`, `pnc-consultations`, `links-and-passwords`, `memefriday`, `standard-operating-procedures-sop`, `reviews`, `help`, `intakers`, `pi`. No existen `reportes` ni `notificaciones` (si hubiera privados, el bot no los vería).

## Bloqueo al crearlos

- Intento de crear `reportes` y `notificaciones` como **privados** con `Contract-Bot API`: error `Your Slack credential is missing required Oauth Scopes … Add the following scope(s) to your Slack App: groups:write`. **No se creó nada** en Slack.
- Opciones: (a) añadir el permiso `groups:write` (y `channels:manage`/`groups:read` si faltan) a la app Contract-Bot en api.slack.com y reinstalarla (lo hace un admin, Mario o quien la creó); (b) **crear los dos canales a mano** en Slack (1 minuto), añadir a `@Contract-Bot` al canal (`/invite @Contract-Bot`) y entonces el bot ya puede publicar con el permiso `chat:write` que usa hoy en `new-contracts`. **Recomendada: (b)**, más rápida y sin tocar permisos de la app.

## Avance (2026-10-12, noche) — canales creados y reportes conectados

- **Jorge creó los dos canales privados a mano** desde la cuenta `varelalaw remote` (`U09EADXPYKC`) y añadió a `@Contract-Bot`. Nombres en inglés: **`#reports` = `C0C8PATFEHY`** y **`#notifications` = `C0C8PAVAUMQ`** (cada uno con 2 miembros: la cuenta de Jorge/`varelalaw remote` y el bot). Mario y el resto del equipo **todavía no están invitados**.
- Mensaje de prueba publicado con el bot en cada canal (ejecución #2783, `success`); workflows temporales (`recon`, `crear canales`, `ids`, `prueba`) ya archivados. Nota: las descripciones de los canales no se pusieron (el intento de creación falló antes de ese paso); se pueden poner a mano.
- **Reportes conectados a `#reports`** (además del correo a Mario, que no se tocó), publicados: `Radar Billing - Agenda Deadlines y Audiencias (Diario)` (`4QsJaKlmHDhkVtBV`), `Borrador Avisos de Facturas Nuevas (Diario)` (`lTVFM7I3wJBpW7we`) y `Reporte Facturas Vencidas (Semanal)` (`ZxZONW1XANkoP1ay`). En cada uno, dos nodos nuevos colgados de la salida "sí" del IF, en paralelo al correo: `Formato Slack` (Code: HTML a texto de Slack, máx. 15 filas, el resto "…y N más. El detalle completo va en el correo.") y `Publicar en Slack #reports` (credencial `Contract-Bot API`, `onError: continueRegularOutput` para que un fallo de Slack no afecte el correo; **efecto: un fallo de Slack sería silencioso**).
- Probado dentro de n8n con `test_workflow` (Outlook y Slack simulados; ejecución #2784 de la agenda: el formateador produjo el texto esperado y ambas ramas, correo y Slack, se activaron). El formateador también se probó en local con ejemplos de los tres reportes (incluidas 54 facturas → recorta a 15). **No se ha visto aún en Slack un reporte real**: se verá mañana ~7:00 AM (agenda, si hay eventos) y el lunes 2026-10-19 8:00 AM (facturas vencidas).
- Cuando se quite el correo, ajustar el texto "El detalle completo va en el correo" del `Formato Slack`.

## Pendientes

- [x] Jorge crea los canales privados (`#reports`, `#notifications`) y añade a `@Contract-Bot`. [x] IDs obtenidos y mensaje de prueba en cada uno. [x] Reportes conectados a `#reports`.
- [ ] Avisar a Mario e invitarlo (y a quien él decida: Rosa `U0BB5SYRU84`, etc.) a `#reports` y `#notifications`; hasta entonces solo ve los canales la cuenta `varelalaw remote`.
- [ ] Mañana ~7:00 AM: comprobar que la agenda publicó en `#reports` (si hay eventos) sin errores.
- [ ] Conectar las notificaciones a `#notifications`: Zelle (registrado / revisión manual), contratos procesados (`CONTRACTS FROM SLACK`, hoy notifica a `new-contracts`) y Texto.
- [ ] Decidir cuándo quitar el correo a Mario.
- [ ] Revisar/limpiar credenciales de Slack: `Slack account` está revocada.
