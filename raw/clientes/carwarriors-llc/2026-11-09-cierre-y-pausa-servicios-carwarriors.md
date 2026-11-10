# Bitácora Operativa: Cierre y Pausa de Servicios — Car Warriors LLC

**Fecha:** 9 de Noviembre de 2026  
**Hora:** 16:10 EDT (Miami)  
**Origen de la decisión:** Notificación directa de Jorge González (Dueño y Decisor Principal de Car Warriors LLC)  
**Estado:** Pausa / Cese de servicios comunicado por el cliente  
**Responsable:** FORJADO / Antigravity  

---

## 1. Notificación y Motivo

En la fecha de hoy, **Jorge González** comunicó la decisión de **pausar/dejar de trabajar por ahora** con FORJADO en los servicios de automatización, gestión técnica y estandarización de inventario.

De acuerdo con el protocolo institucional, se procede al:
1. **Registro documental integral** del estado en que queda cada sistema, plataforma y entregable.
2. **Corte y congelación segura** de tareas activas de automatización y procesamiento fotográfico.
3. **Consolidación de activos entregados** para auditoría y entrega final a los stakeholders (Jorge González y Bianca Cangialosi).

---

## 2. Balance del Encargo de Estandarización de Fotos (Bianca Cangialosi)

El proyecto de estandarización fotográfica con escenario virtual *"Car Warriors · Graffiti Garage"* y sustitución institucional de matrículas a través de **Cleverwave Studio** y actualización directa en **DealerCenter** (vehículos con `Custom Status: LISTO VENTA`) queda con un balance final de **29 de 32 vehículos completados (90.62%)**:

### Desglose por Lotes:
- **Lote 1 (11 vehículos):** 100% completado, fotos estandarizadas cargadas y verificadas en DealerCenter con portada frontal 3/4 en Posición #1.
- **Lote 2 (11 vehículos):** 100% completado, fotos estandarizadas cargadas y verificadas en DealerCenter con portada frontal 3/4 en Posición #1.
- **Lote 3 (10 vehículos):** 7 completados y guardados en DealerCenter, 3 unidades congeladas en fase de render/carga:
  1. `2018 Ford F150` (`ND43063`): 12 fotos guardadas en DealerCenter (`Photos (12)`), portada en Pos #1. ✅
  2. `2022 Dodge Challenger` (`N117374`): 12 fotos guardadas en DealerCenter (`Photos (12)`), portada en Pos #1. ✅
  3. `2018 Ford F150` (`ND64512`): 12 fotos guardadas en DealerCenter (`Photos (12)`), portada en Pos #1. ✅
  4. `2019 Ford F150` (`NC47730`): 12 fotos guardadas en DealerCenter (`Photos (12)`), portada en Pos #1. ✅
  5. `2020 Hyundai Santa Fe` (`N278625`): 11 fotos guardadas en DealerCenter (`Photos (11)`), portada en Pos #1. ✅
  6. `2020 Mercedes-Benz GLE 350` (`N108736`): 10 fotos guardadas en DealerCenter (`Photos (10)`), portada en Pos #1. ✅
  7. `2020 Subaru Forester` (`N560770`): 12 fotos guardadas en DealerCenter (`Photos (12)`), portada en Pos #1. ✅
  8. `2022 Genesis GV70` (`N036430`): Fotos raw descargadas en local (`Temp/raw_N036430`), proyecto en Cleverwave pendiente de render. ⏸️ Congelado.
  9. `2023 Dodge Challenger` (`N503769`): 12 fotos raw descargadas en local (`scratch/batch3_raw/`). ⏸️ Congelado.
  10. `2024 Mazda CX90` (`N143102`): 12 fotos raw descargadas en local (`scratch/batch3_raw/`). ⏸️ Congelado.

---

## 3. Estado de la Infraestructura y Sistemas Operativos

| Sistema / Componente | Estado Operativo | Recomendación / Próximo Paso |
|---|---|---|
| **DealerCenter (Portal & Media)** | Operativo (29 vehículos con fotos actualizadas) | Proceder al cierre de sesiones automáticas y resguardo de credenciales. |
| **Cleverwave Studio** | Operativo (Clock-in activo en Miami) | Cerrar sesión y desvincular proxies o emuladores CDP. |
| **Bot n8n + OpenRouter (CW & Rances)** | En producción en VPS (`PRINCIPAL` y `PRINCIPAL - Rances`) | Evaluar con Jorge si se mantienen activos o se pausan los webhooks en GHL. |
| **Lead Sync GHL ↔ DealerCenter (SFTP)** | Activo (ejecución periódica SFTP/ADF) | Determinar si se desactiva el cron en n8n o se deja en piloto automático. |
| **Alertas Slack (#notificaciones, #auditoria-leads)** | Activo | Mantener silenciado o deshabilitar nodos para evitar consumo de tokens. |
| **Base de Datos MongoDB Atlas** | Activa y sincronizada (`leads`, `leads_master`) | Realizar export de respaldo de datos de Car Warriors por seguridad. |

---

## 4. Archivo de Artefactos y Código Local

Todos los scripts generados para la automatización (`scratch/process_b64_zip.js`, `scratch/build_dc_inject.js`, `scratch/build_cw_inject.js`), así como los ZIPs procesados y convertidos a JPG de alta calidad quedan archivados en `scratch/batch3_processed/` para cualquier reactivación futura.
