#!/usr/bin/env bash
# Replica en esta máquina la reestructuración de ~/Desktop/PROYECTOS/FORJADO
# hecha el 2026-09-07. Correr DESDE la carpeta FORJADO en la otra compu:
#   cd ~/Desktop/PROYECTOS/FORJADO   (ajustar la ruta si es distinta)
#   bash replicar-reestructuracion-forjado.sh
#
# Es defensivo: cada mv chequea que el origen exista y el destino no exista
# antes de moverlo. No borra nada por su cuenta salvo al final, y solo con
# confirmación explícita si detecta contenido que podría no coincidir.

set -e

say() { echo; echo "== $1 =="; }

# 0. Sanity check: estamos en la carpeta correcta?
if [ ! -d "Applications" ] && [ ! -d "aplicaciones" ]; then
  echo "No encuentro 'Applications/' ni 'aplicaciones/' en $(pwd)."
  echo "Corré este script parado DENTRO de la carpeta FORJADO."
  exit 1
fi

# 1. Carpetas nuevas de nivel superior
mkdir -p aplicaciones/carwarriors aplicaciones/varela-law aplicaciones/forjado

# 2. Apps -> aplicaciones/<cliente>/<repo>
move_if_needed() {
  local src="$1" dst="$2"
  if [ -d "$dst" ]; then
    echo "  ya existe: $dst (salteando)"
  elif [ -d "$src" ]; then
    mv "$src" "$dst"
    echo "  movido: $src -> $dst"
  else
    echo "  no encontrado (ya migrado o no existe en esta compu): $src"
  fi
}

say "1/4 — Moviendo apps a aplicaciones/<cliente>/"
move_if_needed "Applications/Carwarriors/dealer-center-scraper"     "aplicaciones/carwarriors/dealer-center-scraper"
move_if_needed "Applications/Varela Law/Varela-auto-contracts"      "aplicaciones/varela-law/automated-legal-contracts"
move_if_needed "Applications/Forjado/lead-discovery"                "aplicaciones/forjado/lead-discovery"
move_if_needed "Applications/Forjado/modern-portfolio"               "aplicaciones/forjado/portfolio-dev"

# 3. Renombrar las 2 bóvedas
say "2/4 — Renombrando FORJADO-Development -> desarrollo, FORJADO-ContentCreationSystem -> contenido"
[ -d "FORJADO-Development" ] && mv "FORJADO-Development" "desarrollo" && echo "  FORJADO-Development -> desarrollo" || echo "  FORJADO-Development no encontrado (¿ya renombrado?)"
[ -d "FORJADO-ContentCreationSystem" ] && mv "FORJADO-ContentCreationSystem" "contenido" && echo "  FORJADO-ContentCreationSystem -> contenido" || echo "  FORJADO-ContentCreationSystem no encontrado (¿ya renombrado?)"

# 4. Traer los commits nuevos (incluye el engine/ ya versionado en contenido)
say "3/4 — git pull en desarrollo y contenido"
if [ -d "desarrollo/.git" ]; then
  (cd desarrollo && git pull origin main)
else
  echo "  desarrollo/.git no encontrado — revisar a mano"
fi
if [ -d "contenido/.git" ]; then
  (cd contenido && git pull origin main)
else
  echo "  contenido/.git no encontrado — revisar a mano"
fi

# 5. AI-Content-Automation-Engine: ahora vive versionado en contenido/engine/.
# El de Applications/Forjado/ (si existe en esta compu) NUNCA estuvo en git,
# así que puede haber diverger del que se subió desde la otra máquina.
# No lo borro solo — comparo y aviso.
say "4/4 — Verificando AI-Content-Automation-Engine (motor de contenido)"
OLD_ENGINE="Applications/Forjado/AI-Content-Automation-Engine"
NEW_ENGINE="contenido/engine"
if [ -d "$OLD_ENGINE" ]; then
  if diff -rq "$OLD_ENGINE" "$NEW_ENGINE" > /tmp/engine-diff.txt 2>&1; then
    echo "  Idéntico al de contenido/engine/ — se puede borrar con seguridad:"
    echo "    rm -rf \"$OLD_ENGINE\""
  else
    echo "  ⚠️  DIFIERE de contenido/engine/ — revisar antes de borrar:"
    echo "     cat /tmp/engine-diff.txt"
    echo "  (no lo borro automáticamente para no perder cambios locales de esta compu)"
  fi
else
  echo "  No existe en esta compu — nada que reconciliar."
fi

# 6. Limpiar carpetas contenedoras vacías
say "Limpieza de carpetas vacías"
find Applications -type d -empty -delete 2>/dev/null || true

echo
echo "Listo. Estructura esperada:"
echo "FORJADO/"
echo "├── aplicaciones/{carwarriors,varela-law,forjado}/..."
echo "├── desarrollo/"
echo "└── contenido/"
