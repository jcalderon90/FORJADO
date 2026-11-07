# Directorio Agent (`agent/`)

Estructura de compatibilidad para herramientas y skills de agentes.

> [!NOTE]
> Las habilidades activas primarias y la suite completa de skills del espacio de trabajo residen en [`.agents/skills/`](../.agents/skills). 

---

## Contenido
- `skills/find-skills/`: Versión inicial/reserva de la skill de descubrimiento de capacidades e instalación de paquetes de habilidades.

## Relación con `.agents/`
Para evitar discrepancias entre diferentes entornos de ejecución de LLM y agentes (Claude Code, Antigravity, OpenHands), se conserva esta ruta para aquellos clientes que busquen skills en `agent/` en lugar de `.agents/`.
