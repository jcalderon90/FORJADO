---
tags: [forjado, ventas, prospeccion, hispanoamerica, ai-job-search]
tipo: plan
estado: borrador
servicio: automatizacion-e-ia
creado: 2026-11-10
actualizado: 2026-11-10
---

# Plan — Prospección en Hispanoamérica con el patrón de AI Job Search

> [!info] Objetivo
> Recuperar los $200/mes perdidos con Carwarriors (2026-11-09) y construir ingreso recurrente: encontrar negocios de habla hispana (Norteamérica, Centroamérica y Sudamérica) que necesiten lo que FORJADO ya sabe hacer. Pipeline en [[pipeline]]; oferta en [[pack-inmobiliario]].

## Cómo se usa el repo

El repo `ai-job-search-dev/ai-job-search` (MIT, activo: último commit 2026-11-09) se usa como **patrón**, no como producto. Se adapta en un repo privado propio. Se reutiliza: flujo `scrape → rank → apply → outcome`, deduplicación y tracker, triaje por lotes con agente, revisor de propuestas, salvaguardas contra texto no confiable. Se reescribe: fuentes de datos, perfil (pasa de "candidato" a "oferta de FORJADO") y `/apply` (pasa de CV y carta a propuesta comercial).

Un workspace separado, sin mezclar, para la búsqueda de empleo personal.

## A quién buscar (hipótesis a validar)

Sectores donde FORJADO ya tiene prueba o experiencia:

| Sector | Prueba que tenemos | Oferta principal |
|---|---|---|
| Dealers de autos usados | Carwarriors (bot + sync de leads) | Agente de WhatsApp + sync CRM |
| Bufetes de abogados | Varela Law (n8n + contratos) | Automatización de facturación y contratos |
| Servicios a domicilio / telecom | Rogers México (propuesta) | Bot calificador + agenda |
| Inmobiliarias y desarrolladoras | Experiencia profesional del equipo | [[pack-inmobiliario]] |
| Negocios con catálogo o taller | Applecell | Catálogo + cotizador |
| Equipos de ventas o soporte remotos | Time Control (en adaptación) | Control horario B2B |

## Señales que puntúan un prospecto

Alta: usa WhatsApp para vender, pone anuncios pagados, responde lento o fuera de horario, no tiene web o la tiene desactualizada, tiene varios asesores o sucursales. Baja: negocio unipersonal sin volumen de leads, cadena grande con equipo de TI propio.

## Fuentes (por orden de prioridad)

1. **Meta Ad Library**: negocios que ya invierten en publicidad, indicio claro de presupuesto.
2. **Google Maps / directorios por ciudad y nicho.**
3. **Portales sectoriales** (autos, inmobiliario, legal).
4. LinkedIn solo manual: el README del repo advierte que su acceso automatizado va contra los términos de servicio, así que no se automatiza.

## Reglas de contacto

- Respetar términos de uso y `robots.txt` de cada fuente.
- Cumplir normas de mensajería y datos por país (ej. LFPDPPP en México, CAN-SPAM en EE. UU.); primer contacto personalizado, con opción de baja.
- No contactar clientes de RedTec/Garoo ni usar su documentación.
- Sin credenciales ni datos de terceros en el repo.

## Fases

1. [x] Crear repo `prospeccion` en `aplicaciones/forjado/` (2026-11-10, solo local).
2. [x] Escribir el **perfil de oferta** FORJADO (`perfil-oferta.md`, con lo no confirmado marcado).
3. [ ] Primera fuente: Meta Ad Library + Google Maps para un nicho y un país piloto.
4. [ ] Ranking de 20 prospectos y revisión manual.
5. [ ] Propuesta personalizada y primeros 10 contactos.
6. [ ] Medir respuestas y ajustar. Meta: 1–2 clientes de $250/mes.

## Decisiones (2026-11-10)

- **Mercados:** México, Ecuador y EE. UU. (clientes que se comuniquen en español), y luego toda Latinoamérica. El criterio es el idioma del cliente, no el país.
- **Repo:** `aplicaciones/forjado/prospeccion/` (creado, git local sin remoto; propuesto por Claude, no confirmado explícitamente).
- **Sectores:** sin nicho único; se prioriza por señales de calificación (ver tabla de sectores).

## Pendientes

- Elegir el primer nicho y país para la primera corrida (ej. `/prospectar México dealers de autos --fuente maps`).
- Presupuesto de API/tokens para el ranking.
- Crear el remoto privado en GitHub cuando se decida.
- Escribir `/proponer` y `/seguimiento` cuando haya prospectos reales.

## Relacionado
- [[pack-inmobiliario]]
- [[pipeline]]
- [[../servicios/catalogo-de-servicios]]
