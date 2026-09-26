# Remoción de enlace "Automated with this n8n workflow" en todas las notificaciones Slack (Carwarriors)

- **Fecha:** 2026-09-26 15:58 Miami
- **Contexto:** En la aplicación móvil y de escritorio de Slack, los nodos nativos `n8n-nodes-base.slack` inyectan por defecto un enlace al final del mensaje (`_Automated with this n8n workflow_`) debido al flag `@default true` en el parámetro `otherOptions.includeLinkToWorkflow`. Esto ensucia los reportes y confunde la visualización de los cierres de mensajes.

---

## 1. Alcance y Workflows Actualizados

Se auditaron los 19 workflows de la instancia de Carwarriors en n8n (`n8n-carwarriors`) y se configuró `"includeLinkToWorkflow": false` dentro de `otherOptions` en todos los nodos de tipo `n8n-nodes-base.slack` (11 nodos distribuidos en 9 workflows):

1. **`DealerCenter -> Slack (Reporte Diario Leads Incompletos)` (`jc317DtnKMYEscC5`):**
   - Nodo: `Enviar Reporte a Slack`
   - Active Version ID: `3396154f-6f70-4712-95b0-87bdf53533b5`

2. **`NOTIFICATIONS` (`oz7EabosHGTXtTjr`):**
   - Nodo: `Send a message`
   - Active Version ID: `c2a56fc6-fa3b-4b52-8578-c36b5a784fb5`

3. **`ERROR HANDLER` (`ypd1lxqlsa5KXsoy`):**
   - Nodo: `Send a message`
   - Active Version ID: `44d1db6e-1957-48e6-ab17-c4de21da1aea`

4. **`DealerCenter -> Slack (Reporte Mensual Ventas Retail)` (`31dHApU2tl76cG4B`):**
   - Nodo: `Enviar Reporte a Slack`
   - Active Version ID: `e2e7f64a-277d-4bb5-ba36-a84fb1296875`

5. **`PRINCIPAL` (`Kif9lWwDHvR7TT39`):**
   - Nodos: `Send a message`, `Alert Slack - Mensaje No Entregado`
   - Active Version ID: `a949ded6-de72-4a20-981f-716c53b0915c`

6. **`PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`):**
   - Nodos: `Send a message`, `Alert Slack - Mensaje No Entregado`
   - Active Version ID: `7b5db214-8866-4768-ab08-63730b4ed4ca`

7. **`LEAD - COLLECTOR` (`4r00JFnCyoUpZgXU`):**
   - Nodo: `Avisar Lead Multi-Dealer`
   - Active Version ID: `22d5e54c-6c48-4ea2-9ebe-2a14626826e9`

8. **`MONITOR - Gmail Credential Check` (`VQxUXBWCOcQgBFOi`):**
   - Nodo: `Send a message`
   - Active Version ID: `aa5b437c-881c-4eec-8c0c-3a4f543e22f1`

9. **`SLACK - INBOUND (DM / Menciones)` (`xRRGjidR0rckn3R7`):**
   - Nodo: `Responder en Slack`
   - Active Version ID: `7cc93d4e-b25b-4e00-a50f-1978995fc922`

---

## 2. Verificación en Vivo

- Se ejecutó el test del reporte diario (`jc317DtnKMYEscC5`, Ejecución ID `9678`).
- Resultado: **`status: success`** en 3.18s.
- Entrega verificada en `#auditoria-leads`: el mensaje finaliza directamente en el pie de página y barra divisoria definida (`🏁 Fin de Auditoría Diaria`), sin el enlace de atribución de n8n.
