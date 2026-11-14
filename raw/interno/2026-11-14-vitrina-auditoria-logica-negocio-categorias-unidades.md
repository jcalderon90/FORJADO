---
fecha: 2026-11-14
tipo: sesion
tags: [forjado, vitrina, logica-de-negocio, categorias, pedidos, inventario, planes]
---

# Vitrina — Auditoría e implementación de lógica de negocio, catálogo multi-giro y cierre de brechas (2026-11-14)

## Contexto
Revisión de cobertura de giros de negocio en Cuba para Vitrina (incluyendo el caso de estudio fotográfico y servicios locales similares) y auditoría integral de lógica de negocio entre módulos en `aplicaciones/forjado/vitrina/vitrina-backend` y `aplicaciones/forjado/vitrina/vitrina-frontend`.

## Cambios implementados

### 1. Ampliación de categorías y unidades para negocios cubanos
- **5 nuevas categorías** en `vitrina-backend/src/modules/business/categories.ts` y `vitrina-frontend/src/lib/categories.ts`:
  - `joyeria-relojeria` (grupo `moda-belleza`)
  - `alquiler-hospedaje` (casas particulares, hostales, alquiler de locales/equipos)
  - `impresion-personalizados` (estudios fotográficos, imprentas, sublimación y personalizados)
  - `salud-bienestar` (grupo `servicios` — ópticas, clínicas, terapias, fisioterapia)
  - `mascotas-veterinaria` (grupo `otros`)
- **6 nuevas unidades de venta** en `vitrina-backend/src/modules/products/product.model.ts` (`PRODUCT_UNITS`) y `vitrina-frontend/src/lib/business.ts` (`SERVICE_UNITS` y `PRODUCT_UNITS`):
  - `dia`, `metro`, `persona`, `mes`, `desde`, `cotizar`.
- **Precios bajo consulta (`0`):**
  - Actualizado `formatPrice` en `vitrina-frontend/src/lib/money.ts` y `formatMoney` en `vitrina-backend/src/modules/ai/ai.provider.ts` para mostrar `"A consultar"` cuando `amount === 0` / `amountInCents === 0`.

### 2. Sincronización de lógica de negocio en Pedidos (`orders`), Inventario y Gestores
- **`vitrina-backend/src/modules/orders/order.service.ts` y `order.routes.ts`:**
  - `orderService.create`: cruza cada ítem contra `ProductModel` (cuando existe) para utilizar nombre, unidad y precio autoritativos del catálogo según la moneda solicitada.
  - `orderService.setStatus`: al transicionar a `'completed'` (de forma idempotente si ya estaba completado):
    - Descuenta `stockQty` en `ProductModel` y cambia `availability` a `'sold_out'` cuando llega a `0`.
    - Registra un movimiento `'sale'` en `StockMovementModel`.
    - Si `row.managerCode` coincide con un `BusinessMemberModel` activo y el producto tiene `commission.value > 0`, crea automáticamente el registro `'confirmed'` en `SaleModel`.
- **`vitrina-backend/test/orders.test.ts`:**
  - Añadidos mocks de `ProductModel`, `StockMovementModel`, `BusinessMemberModel` y `SaleModel`, más un nuevo test de integración que verifica resolución de precio desde catálogo, descuento de stock, creación de movimiento `'sale'`, registro de comisión en `SaleModel` e idempotencia al completar el pedido.
- **`vitrina-frontend/src/lib/cart.ts`:**
  - Actualizado `formatOrderMessage` y el manejador del botón secundario de WhatsApp para sumar `deliveryFee` en `*Total estimado:*` cuando `deliveryType === 'delivery'`.

### 3. Sistema de Planes y Add-ons de IA
- **`vitrina-backend/src/modules/business/business.model.ts` y `test/helpers/fake-models.ts`:**
  - Agregado el subdocumento `aiAddon` (`enabled`, `agentsCount`, `expiresAt`, `channels`) al esquema `businessSchema` y a `BusinessRecord`.
- **`vitrina-backend/src/modules/business/plan-request.schemas.ts` y `plan-request.service.ts`:**
  - Actualizado el enum `targetPlan` a `['free', 'pro', 'enterprise']`.
  - Corregido `approveByAdmin` para aplicar `req.targetPlan` en lugar de forzar `'pro'`, poblando `business.aiAddon` cuando `req.aiAgentsCount > 0`.
- **`vitrina-frontend/src/pages/panel/[slug]/plan.astro`:**
  - Alineadas las tarjetas de planes con `plan.config.ts` (`Hasta 40 productos` en Pro, `90 días` de analíticas en Business y capacidades base de IA incluidas).

## Verificación ejecutada
- **Backend (`vitrina-backend`):**
  - `npm run lint` → 0 errores.
  - `npm run typecheck` → 0 errores.
  - `npm test` → **23 archivos de test, 360 tests pasando** (1 test nuevo respecto a los 359 previos).
- **Frontend (`vitrina-frontend`):**
  - `npm run lint` → 0 errores.
  - `npm run typecheck` → **73 archivos, 0 errores, 0 warnings, 0 hints**.
  - `npm run build` → compilación SSR completada sin errores.

## Pendiente inmediato
- Realizar `commit` y `push` de los cambios en el árbol de trabajo de `vitrina-backend` y `vitrina-frontend`.
