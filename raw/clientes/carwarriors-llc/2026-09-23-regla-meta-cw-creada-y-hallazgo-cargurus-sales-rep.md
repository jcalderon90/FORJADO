---
tags: [forjado, cliente, carwarriors, dealercenter, lead-assignment, meta-cw, cargurus, resuelto]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-23
---

# 2026-09-23 — Creada Rule 33 en DealerCenter (META CW -> Jean Cue) y Hallazgo en Reglas CarGurus

**Contexto:** Jorge Calderón compartió la confirmación de Bianca sobre los 3 puntos de lead assignment pendientes tras la resolución del ticket de round robin de DealerCenter:
1. Leads de META CW $\rightarrow$ Bianca confirmó: `JEAN`.
2. Capital One (respaldo Dayron) $\rightarrow$ Bianca indicó: `déjame que chequee`.
3. CarGurus (mover de BDC Rep a Sales Rep) $\rightarrow$ Bianca aprobó: `Ok perfecto`.

## 1. Conexión en vivo y Creación de Rule 33 (`META CW` -> Jean Cue)
Se navegó en vivo a DealerCenter (`https://app.dealercenter.net/apps/shell/admin/settings/customer/lead-assignment`) con sesión autenticada `jcalderon90`:
- **Creada Rule 33:**
  - `Lead Type`: All
  - `Inquiry Type`: All
  - `Lead Source`: `META CW` (seleccionado del listbox oficial de fuentes existentes).
  - `BDC Rep Assignment Users`: **Jean Cue - JeanCue** (Jean Cue figura registrado en DealerCenter bajo el rol BDC Rep).
  - Guardada exitosamente.
- **Resultado operativo:** Se soluciona de raíz el problema de que los leads entrantes de WhatsApp / Meta (como Copiteyoelho y Andreu Marin) quedaran vacíos sin asesor asignado.

## 2. Hallazgo en Reglas de CarGurus (Rule 7 a 15)
Se intentó aplicar la reasignación de las 9 reglas de CarGurus de la casilla *BDC Rep* a *Sales Rep*:
- **Situación actual:** Las reglas 7 a 15 tienen asignados a `Scarleth Rubi Bdc Nica - Scarleth` y `Carlos Samuel Aguilar - CarlosSamuel`.
- **Bloqueo encontrado:** Al abrir el diálogo de `Sales Rep Assignment Users`, la búsqueda de "Samuel" y "Scarleth" arroja `No result found`.
- **Causa:** En la configuración de usuarios de DealerCenter, Samuel Aguilar y Scarleth Rubi solo tienen asignado el rol/permiso de **BDC Rep**, no de **Sales Rep**. DealerCenter no permite agregarlos a la casilla de Sales Rep a menos que se les active dicho rol en su perfil de usuario o se indique qué Sales Rep real debe recibir estos leads.
- Las reglas de CarGurus se dejaron sin alterar (Cancel) para no romper la rotación actual mientras se aclara este punto.

## 3. Estado de los 3 Puntos
| Punto | Acción | Estado |
|---|---|---|
| **1. META CW** | Crear Rule 33 $\rightarrow$ Jean Cue | **✅ APLICADO Y VERIFICADO EN VIVO** |
| **2. Capital One** | Respaldo para Dayron Barrizonte | **🟡 Pendiente de que Bianca chequee** |
| **3. CarGurus** | Mover de BDC Rep a Sales Rep | **⚠️ Bloqueado en DealerCenter:** Samuel/Scarleth no son Sales Reps en el sistema. Requiere activarles el rol o definir un Sales Rep. |
