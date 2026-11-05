# Bitácora Operativa: Estandarización de Fotos de Inventario con Cleverwave Studio (Car Warriors LLC)

**Fecha:** 4 de Noviembre de 2026  
**Responsable:** Antigravity / Pareja de Programación  
**Cliente:** Car Warriors LLC (Orlando & Bianca)  
**Objetivo:** Automatización de extracción, estandarización fotográfica con escenario institucional (*Car Warriors · Graffiti Garage* + matrículas corporativas) y descarga de lotes de alta resolución de vehículos en status `LISTO VENTA` desde DealerCenter.

---

## 1. Resumen Ejecutivo de Resultados

- **Vehículos procesados al 100% y descargados en ZIP:** **12 vehículos** (163 fotografías de alta resolución estandarizadas).
- **Vehículos restantes con fotos originales extraídas de DealerCenter (1600x1200 px) y preparadas en local:** **10 vehículos**.
- **Límite de cuota detectado en Cleverwave Studio:** Cleverwave impone una cuota por cuenta de **120 fotos procesadas por día** (`"You have reached today’s limit of 120 processed photos. Refresh"`). Se consumió el 100% del cupo diario disponible en la sesión de hoy con los primeros 12 vehículos.

---

## 2. Inventario Procesado y Descargado (12 Vehículos Listos)

Todos los paquetes fueron renderizados en Cleverwave con el escenario **"Car Warriors · Graffiti Garage"**, matrículas oficiales institucionales de Car Warriors, ángulo validado y descargados localmente en `C:\Users\Jorge\Downloads\`:

| # | Vehículo | Stock # | VIN | Fotos | Tamaño ZIP | Estado |
|---|---|---|---|---|---|---|
| 1 | **2023 Alfa Romeo Stelvio** | `ND56867` | `ZASPAJAN5P7D56867` | 25 | 54.3 MB | ✅ Listo y Descargado |
| 2 | **2019 Volvo XC60** | `N284864` | `LYVA22RK0KB284864` | 10 | 18.3 MB | ✅ Listo y Descargado |
| 3 | **2020 Mercedes-Benz GLE 350** | `N033404` | `4JGFB4KB5LA033404` | 13 | 27.0 MB | ✅ Listo y Descargado |
| 4 | **2020 Land Rover Defender 110** | `N027696` | `SALEPEEU4L2027696` | 12 | 23.4 MB | ✅ Listo y Descargado |
| 5 | **2020 Porsche Panamera** | `N100854` | `WP0AA2A70LL100854` | 12 | 22.3 MB | ✅ Listo y Descargado |
| 6 | **2024 Nissan Rogue** | `N670613` | `5N1BT3AA5RC670613` | 12 | 24.7 MB | ✅ Listo y Descargado |
| 7 | **2025 Mercedes-Benz C 300** | `N287843` | `W1KAF4GB5SR287843` | 12 | 23.7 MB | ✅ Listo y Descargado |
| 8 | **2024 Mercedes-Benz GLE 63 S Coupe** | `N096765` | `4JGFD8KB5RB096765` | 10 | 18.5 MB | ✅ Listo y Descargado |
| 9 | **2020 Mercedes-Benz GLE 350** | `N072282` | `4JGFB4KB3LA072282` | 12 | 25.0 MB | ✅ Listo y Descargado |
| 10 | **2014 Honda Accord** | `T011460` | `1HGCR2F36EA011460` | 12 | 24.9 MB | ✅ Listo y Descargado |
| 11 | **2021 Toyota Camry** | `N571568` | `4T1K61AK3MU571568` | 12 | 26.0 MB | ✅ Listo y Descargado |
| 12 | **2023 Tesla Model Y Performance** | `N663099` | `7SAYGDEF2PF663099` | 11 | 22.7 MB | ✅ Listo y Descargado |

**Total fotos estandarizadas:** 163 imágenes en 12 paquetes ZIP individuales, nombrados exactamente con la convención solicitada (`{Año} {Marca} {Modelo} - {Stock}.zip`).

---

## 3. Vehículos Restantes en Cola (Listos para Próximo Lote / Reseteo de Cuota)

Las fotos originales en máxima resolución (1600x1200 px) de los siguientes 10 vehículos ya fueron descargadas directamente desde el CDN de DealerCenter y organizadas en carpetas locales en `raw/clientes/carwarriors-llc/inventario-fotos/`:

1. **2016 Ford Mustang EcoBoost** (`N324337`, 12 fotos)
2. **2023 Honda Odyssey Sport** (`N002745`, 12 fotos)
3. **2024 Honda HR-V LX** (`N726284`, 12 fotos)
4. **2018 Land Rover Range Rover Sport HSE** (`N801861`, 12 fotos)
5. **2018 Land Rover Range Rover Velar S** (`N768691`, 12 fotos)
6. **2020 Cadillac XT6** (`N230639`, 12 fotos)
7. **2019 Audi A6 55 TFSI** (`N077287`, 13 fotos)
8. **2024 Honda Accord LX** (`N032937`, 12 fotos)
9. **2024 Alfa Romeo Tonale Ti** (`N057213`, 12 fotos)
10. **2016 Honda Accord LX** (`RR059697`, 1 foto)

---

## 4. Hallazgo de Plataforma: Cuota Diaria Cleverwave

Al intentar procesar el vehículo #13 (Ford Mustang), Cleverwave Studio emitió la siguiente restricción a nivel de suscripción/plan:
> *"You have reached today’s limit of 120 processed photos. Refresh"*

**Opciones de continuidad:**
1. **Espera natural:** La cuota de 120 fotos se reinicia automáticamente a las 00:00 UTC / medianoche.
2. **Upgrade de Tier:** Consultar con el proveedor de Cleverwave para ampliar el cupo diario de procesamiento de la cuenta `orlandomma86@gmail.com`.
3. **Subida inmediata de los 10 restantes:** Apenas se renueve la cuota, el script de automatización procesará los 10 restantes en menos de 20 minutos ya que las imágenes están descargadas y listas en el repositorio local.

---

## 5. Carga de Fotografías Estandarizadas en DealerCenter (En Vivo)

Se inició la fase de reemplazo fotográfico en DealerCenter (pestaña `Media`):
1. **2023 Alfa Romeo Stelvio (`ND56867`):** Eliminadas fotos originales, cargadas **8 fotos institucionales estandarizadas**, guardado y confirmado en vivo (`Photos (8)`).
2. **2019 Volvo XC60 (`N284864`):** Eliminadas fotos originales, cargadas **10 fotos institucionales estandarizadas**, guardado y confirmado en vivo (`Photos (10)`).
3. **Pausa operativa solicitada por el usuario:** Siguiente vehículo a cargar al reanudar: #3 `2020 Mercedes-Benz GLE 350` (Stock: `N033404`).

