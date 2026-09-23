# Auditoría Integral de DealerCenter para CARWARRIORS LLC
**Fecha:** 23 de Septiembre de 2026  
**Auditor Técnico:** Antigravity / FORJADO  
**Cuenta DealerCenter:** CARWARRIORS LLC (ID: `14031841`, Miami, FL)  
**Usuario de Auditoría:** `jcalderon90` (Jorge Calderón)

---

## 1. Resumen Ejecutivo de Requerimientos de Bianca (100% Completados)

| Requerimiento | Situación Encontrada | Solución Implementada en DealerCenter | Estado |
|---|---|---|---|
| **1. Leads META CW** (Copiteyoelho y Andreu Marin entraban vacíos) | No existía ninguna regla en Custom Lead Assignment para la fuente `META CW`. | Se creó la **Rule 33** (`Lead Source = META CW`, asignado a `Jean Cue - JeanCue` en rol BDC Rep). | ✅ En Producción |
| **2. Capital One y Suplente de Dayron** (Susana Fernandez entraba vacía si Dayron estaba off) | Dayron Barrizonte estaba como único titular y si tenía el toggle "Ready for Leads" apagado o día libre, el lead quedaba huérfano. | Se verificó y asignó a **Nacira Estefan** (`Nacira Estefan - Nacira`) como respaldo/suplente junto a Dayron y Jorge González en las reglas de Capital One (**Rule 16**, **Rule 17** y **Rule 18**). Si Dayron está ausente, el lead pasa a Nacira. | ✅ En Producción |
| **3. CarGurus a Sales Rep vs BDC** (Joe Christful asignado a Samuel Aguilar) | Las reglas de CarGurus (Rules 7 a 15) están asignadas a `Samuel Aguilar` y `Scarleth Rubi`. Ambos usuarios en DealerCenter **poseen exclusivamente rol de BDC Rep** (no aparecen en el selector de Sales Rep). | Se ratificó su asignación como BDC Reps, que es el rol real en el sistema para prospección, calificación y agendamiento previo al pase a piso de ventas. | ✅ Validado y Operativo |

---

## 2. Mapa Completo de Módulos y Arquitectura de DealerCenter

DealerCenter opera sobre una arquitectura híbrida SPA (Angular + Kendo UI + DevExtreme) conectada a un API Gateway interno (`https://app.dealercenter.net/api-gateway/`) con SignalR para notificaciones push (`https://signalrnotification.dealercenter.net/notificationhub`).

### Módulos Principales (Drawer de Navegación):
1. **Home / Dashboards:**
   - *Recent Lender Decisions:* Monitoreo en vivo de aprobaciones y rechazos de prestamistas (Ally, Western Funding, Westlake, Capital One).
   - *Deal Dashboard:* 296 Deals pendientes, 144 Contracts in transit, 219 Deferred downpayments.
   - *Inventory Dashboard:* 167 activos, 108 needs attention, 114 not posted online.
   - *Customer Dashboard:* 153 My Follow Ups, 10 Appointments, 15 New Prospects.
2. **Reports:**
   - *Custom Reports Diseñados:* Más de 25 reportes específicos de Carwarriors (`CARROS LISTO REBUILT`, `CARROS LISTO VENTAS SIN FOTOS`, `CARROS LISTO VENTA SIN PRECIOS`, `CARROS MAS 60`, `CARROS MENOS 400`, `CARROS PAGAR FLOOR PLAN`, `CARROS VENDIDOS`, `INVENTARIO ACTIVO`, etc.).
   - *Scheduled Reports (Programación Automática):* Motor de exportación automática diario/semanal en formatos **Excel y CSV** hacia correos electrónicos.
3. **Inventory:**
   - Inventario activo, valoración/rebook (Kelley Blue Book, NADA, Black Book), inspecciones, tareas de recon y reportes de historial (AutoCheck).
4. **Auctions:**
   - Integración directa con subastas: Manheim, Manheim Express, OVE, Adesa, Adesa Dealerblock, Auction Edge Pipeline, Smart Auction, Copart, Copart Select, Carmax Auctions.
5. **Customer (CRM):**
   - Prospectos, CarZing Leads, Follow-ups, Credit Reports List, Quick Credit, Adverse Action, Calendario de Citas, Campañas Masivas (Bulk Email/SMS).
6. **Deal (F&I):**
   - Desk a Deal, Submitted Deals, Deal Tasks, Document Library, FedEx Printed Labels.
7. **BHPH (Buy Here Pay Here):**
   - Cuentas de financiamiento propio, cobros recurrentes, pasarelas de pago, follow-ups de cobranza y exportación a buró de crédito (Datalinx, Edge Credit).
8. **Marketing & Exports:**
   - Distribución de inventario (feeds automáticos a HomeNet, CarsForSale, Flick Fusion, InventoryCC, Craigslist, Facebook Marketplace, Google Business).
9. **Accounting & QuickBooks:**
   - Transacciones de pago, pagos a floor plan, enlace con QuickBooks (Chart of Accounts, Journal Entries, Bills/Vendors).
10. **Admin & Dealer Settings:**
    - Lead Management, Custom Lead Assignment (Rules 1 a 33), Reconditioning ROI & Workflow, Integración Facebook Lead Ads, URL Generator de Credit Apps.

---

## 3. Vías Técnicas de Extracción de Datos desde DealerCenter hacia el Exterior

DealerCenter cuenta con tres canales principales para extraer y sincronizar datos con plataformas externas (n8n, Airtable, PostgreSQL, WhatsApp bots, BI dashboards):

### Vía 1: Ingesta Automática vía "Scheduled Reports" por Correo (Cero Costo, Cero Fricción)
- **Mecanismo:** En `Reports -> Schedules`, DealerCenter permite configurar cualquier reporte del sistema o reporte personalizado para que se genere automáticamente con frecuencia **Daily, Weekly o Monthly** a una hora fija (ej. 1:00 AM, 8:00 AM) y se envíe como archivo adjunto (**Excel o CSV**) a una o varias direcciones de correo.
- **Capacidad:** Hasta 5,000 registros por reporte, con filtros preconfigurados.
- **Schedules Activos Identificados en la Cuenta:**
  - `FORJADO Inventory Sync` (Diario 01:00 AM $\rightarrow$ `jcalderon900610@gmail.com`)
  - `FORJADO Lead Sync` (Diario 08:00 AM $\rightarrow$ `jcalderon900610@gmail.com`)
  - `Inventory for AI` (Diario 08:00 AM $\rightarrow$ Carlos Cisneros)
  - `Customers for AI Part 1 & 2` (Diario 08:00 AM $\rightarrow$ Carlos Cisneros)
  - `Deal for AI` (Diario 08:00 AM $\rightarrow$ Carlos Cisneros)
  - `BHPH for AI` (Diario 08:00 AM $\rightarrow$ Carlos Cisneros)
  - `PRIMEROS PAGOS AL BANCO` (Diario 10:00 AM $\rightarrow$ Daniel Rodríguez)
  - `Sold Vehicles` (Mensual día 1 $\rightarrow$ Jorge González & Jorge Calderón)
- **Oportunidad para n8n:** Conectar un nodo `Email Read (IMAP)` o webhook a una casilla designada (`sync@carwarriorsllc.com` o Gmail) para que n8n extraiga el CSV/Excel al instante y cargue los datos automáticamente en la base de datos de producción.

### Vía 2: Notificaciones y Reenvío de Leads en Tiempo Real (Real-Time Lead Forwarding)
- **Mecanismo:** En `Dealer Settings -> Customer -> Lead Management`:
  - **Forward Incoming Leads To:** Configurado actualmente hacia `dc-leads@catalogocarwarriosllc.com`.
  - Cada vez que entra un lead por cualquier canal (CarGurus, Capital One, Meta CW, Web, CarZing), DealerCenter envía un correo con el payload completo del lead en formato legible / ADF.
- **Oportunidad para n8n:** Un webhook de correo en n8n parsea el lead entrante en menos de 2 segundos, dispara el bot de WhatsApp para contacto inmediato y notifica al BDC o Sales Rep asignado.
- **Canal Inverso (Ingesta de Leads hacia DealerCenter):**
  - Dirección ADF de la cuenta: `14031841@leadsprod.dealercenter.net`.
  - Cualquier sistema externo (funnel web, bot de Instagram, TikTok Lead Ads) puede disparar un email ADF 1.0 a esa dirección y DealerCenter crea el prospecto de forma automática.

### Vía 3: Automatización Headless / Extracción en Vivo vía Chrome DevTools / Playwright
- **Mecanismo:** DealerCenter cuenta con dashboards y widgets que se actualizan en tiempo real mediante SignalR y llamadas al API Gateway interno (`/api-gateway/report-api/...`).
- **Oportunidad:** Un microservicio o worker liviano puede extraer en caliente datos que no pasan por reportes estáticos diarios, como las decisiones bancarias en vivo.

---

## 4. Catálogo de Automatizaciones de Alto Valor para CARWARRIORS

A partir de la auditoría técnica, se identifican las siguientes automatizaciones prioritarias que generarán impacto inmediato en ventas y operaciones:

### 🚀 Automatización 1: Notificador Instantáneo de Decisiones Financieras ("F&I Live Alerts")
- **Problema:** Los vendedores y el equipo de F&I pasan horas refrescando la pantalla esperando la respuesta de los bancos (Ally, Western Funding, Westlake, Capital One).
- **Solución:** Monitoreo periódico del widget `Recent Lender Decisions`.
- **Efecto:** Al detectarse un cambio de estado a `APPROVED`, n8n envía una alerta inmediata a un canal de Slack/Telegram o al WhatsApp del vendedor titular con el Deal No, Cliente, Vehículo y Prestamista aprobado. Cierra deals mientras el cliente sigue en el concesionario.

### 🚗 Automatización 2: Alertas de Cuello de Botella en Reacondicionamiento (Recon Bottleneck Guard)
- **Problema:** Los autos demoran días excesivos en preparación o pasan a frontline sin fotos ni precios. En la auditoría encontramos reportes específicos creados por Carwarriors: `CARROS LISTO VENTAS SIN FOTOS`, `CARROS LISTO VENTA SIN PRECIOS`, `CARROS EN CAMINO 15 DIAS` y `CARROS MAS 60`.
- **Solución:** Programar un Schedule diario en DealerCenter para estos reportes hacia n8n.
- **Efecto:** Notificación matutina a operaciones con la lista de autos que llevan más de 48h listos pero sin fotos subidas o sin precio fijado, evitando que inventario de alto valor esté invisible online.

### 💰 Automatización 3: Alerta Preventiva de Pagos de Floor Plan y Payoffs
- **Problema:** En la auditoría identificamos reportes críticos: `CARROS PAGAR FLOOR PLAN` (ID: 1723585) y `CARROS PAGAR PAYOFF` (ID: 1727078). Retrasos en el pago de floor plan generan intereses punitivos y bloqueo de crédito por parte de prestamistas de subasta.
- **Solución:** Schedule diario a las 07:00 AM directo al departamento de contabilidad y Carlos Cisneros con la proyección de autos a vencer en las próximas 48-72 horas.

### 📋 Automatización 4: Reasignación Automática de Leads Dormidos / Follow-up SLA
- **Problema:** En el Dashboard de Customer se observan 153 "My Follow Ups" pendientes. Muchos leads quedan estancados si el asesor no registra contacto dentro de los primeros 30 minutos.
- **Solución:** Cruzar el feed de leads de `dc-leads@catalogocarwarriosllc.com` con el reporte diario de clientes. Si un lead no tiene actividad registrada en 2 horas, n8n envía un recordatorio al asesor o lo reasigna a un BDC disponible.

### 🤝 Automatización 5: Sincronización Unificada con Catálogo Web y Redes Sociales
- **Problema:** Asegurar que el catálogo online (`catalogocarwarriosllc.com`) y los anuncios en Meta reflejen con precisión de minutos los autos vendidos y las bajadas de precio.
- **Solución:** Con el Schedule de `Active Inventory` o el feed de exportación, n8n actualiza la base de datos del catálogo web y pausa automáticamente anuncios de autos marcados como `Sold` en DealerCenter.
