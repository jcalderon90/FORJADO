---
tags: [forjado, moc, inicio]
tipo: moc
estado: activo
creado: 2026-06-17
actualizado: 2026-06-17
---

# 🏠 FORJADO — Panel

> [!abstract] Qué es FORJADO
> Agencia multi-servicio que **forja** soluciones digitales a la medida: automatización e IA, marketing y contenido, desarrollo de software y consultoría. Operada hoy por un solo fundador, con trato directo y ejecución ágil.

> [!todo] Datos a completar
> - **Fundador:** _(tu nombre)_
> - **Contacto:** jorge.calderon@garooinc.com
> - **Sitio web / redes:** _(pendiente)_
> - **Forma legal / facturación:** _(pendiente)_

---

## 🧭 Navegación

### 🪪 Marca
- [[Identidad de Marca]]
- [[Posicionamiento y Mensaje]]
- [[Identidad Visual]]
- [[Manifiesto — Por qué FORJADO]]

### 🛠️ Servicios
- [[Catálogo de Servicios (MOC)]]
- [[Automatización e IA]]
- [[Marketing y Contenido]]
- [[Desarrollo de Software]]
- [[Consultoría]]

### 💼 Ventas y clientes
- [[Pipeline (MOC)]]

### ⚙️ Operaciones
- [[Procesos y Entrega]]
- [[Herramientas y Stack]]

### 💰 Finanzas
- [[Modelo de Precios]]
- [[Control de Ingresos y Gastos]]

### 📦 Recursos
- [[MongoDB Database]]
- [[Credenciales]]

---

## ✅ Primeros pasos para arrancar

- [ ] Revisar y afinar [[Identidad de Marca]] con tus datos reales
- [ ] Definir el tagline final en [[Posicionamiento y Mensaje]]
- [ ] Decidir paleta y logo en [[Identidad Visual]]
- [ ] Fijar precios reales en [[Modelo de Precios]] y cada nota de servicio
- [ ] Crear tu primera propuesta con la plantilla `_templates/Plantilla — Propuesta`
- [ ] Registrar tu primer prospecto en [[Pipeline (MOC)]]

---

## 📊 Tableros (activar con Dataview)

> Para que estos bloques funcionen, instala el plugin **Dataview**. Quita los comentarios `%% %%` para activarlos.

%%
```dataview
TABLE estado, sector AS "Sector", contacto AS "Contacto"
FROM "FORJADO/03 - VENTAS Y CLIENTES/Clientes"
WHERE tipo = "cliente"
SORT estado ASC
```

```dataview
TABLE estado, cliente AS "Cliente", fecha_fin AS "Entrega"
WHERE tipo = "proyecto"
SORT fecha_fin ASC
```
%%
