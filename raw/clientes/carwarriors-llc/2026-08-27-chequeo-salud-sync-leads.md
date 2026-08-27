# 2026-08-27 (noche) — Chequeo de salud: sincronización de leads GHL ↔ DealerCenter, confirmada sana con datos reales de hoy

Jorge preguntó si la sincronización de leads sigue funcionando bien. Se revisaron ejecuciones reales (no solo el status "success") de ambas direcciones:

**DealerCenter → GHL** (`DealerCenter -> Mongo -> GHL (Lead Sync)`, `EIF9ufLxqoFWZtQ0`, cron diario 12:30 UTC): última ejecución de hoy (2026-08-27) revisada en detalle — procesó el Excel real de DealerCenter, actualizó a Fernando Cuza Taquechel (contacto existente) y **creó un contacto nuevo en GHL** para Joseph De Rosa (lead real de Facebook con cita agendada). Sin errores en la última semana (`error`/`crashed`: 0 resultados desde 2026-08-20).

**GHL → DealerCenter** (`Subir a DealerCenter`, `ZxcF7cmf3V8FZabx`, webhook por cada contacto nuevo/actualizado en GHL): corrió ~10 veces hoy justo después del sync anterior. Se revisó una ejecución en detalle: el mecanismo de **dedupe funcionó correctamente** — un contacto "NO NAME" (solo con teléfono) ya existía en DealerCenter como lead de ayer ("REFERIDO JOANDRY"), y el flujo lo detectó por Mongo y **evitó subirlo duplicado**. Sin errores en la última semana.

**Conclusión:** ambas direcciones sanas, confirmado con datos de producción reales del mismo día, no solo el estado agregado de las ejecuciones.
