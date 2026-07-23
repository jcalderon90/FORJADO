---
tags: [forjado, carwarriors, dealercenter, sftp, adf-xml, investigacion]
tipo: investigacion-tecnica
estado: en-progreso
cliente: Carwarriors LLC
creado: 2026-07-08
actualizado: 2026-07-22
---

# Investigación — Envío de leads a DealerCenter por SFTP (ADF/XML)

> Objetivo: entender cómo funciona el método de importación de leads de DealerCenter vía SFTP antes de decidir si se construye en n8n o se retoma el enfoque de Cloudflare Worker. Esta nota **no decide** la arquitectura — solo documenta cómo funciona el mecanismo.

## 1. Confirmación: DealerCenter sí soporta importación de leads por SFTP

DealerCenter tiene un mecanismo **oficial y documentado** para recibir leads externos vía SFTP, en formato ADF/XML. Reemplazó al método anterior por email, que dejó de considerarse seguro bajo la norma GLBA (Gramm-Leach-Bliley Act, protección de datos financieros de clientes).

- [Enhancing Your Dealership's Data Security with DealerCenter's Secure ADF Lead Integration](https://support.dealercenter.net/hc/en-us/articles/21593970763156-Enhancing-Your-Dealership-s-Data-Security-with-DealerCenter-s-Secure-ADF-Lead-Integration)
- [Setting up Direct Lead Import](https://support.dealercenter.net/hc/en-us/articles/210093013-Setting-up-Direct-Lead-Import)

> [!note] Acceso a estos artículos
> Los artículos de soporte de DealerCenter están detrás de protección anti-bot (Zendesk/Cloudflare) — no se pudo leer el contenido completo automáticamente, solo los fragmentos indexados por buscadores. Recomendado: entrar manualmente a esos enlaces con la cuenta del cliente para confirmar el paso a paso exacto y capturar pantallas.

## 2. Cómo se obtienen las credenciales SFTP (según lo indexado)

Dentro del panel de DealerCenter, el propio dealer (Jorge/Karel, como admin) debe generarlas — **no las da soporte por ticket**, las genera el usuario mismo:

1. Ir a **Dealer Settings**.
2. Pestaña **Customer** → **Lead Management**.
3. Sección **"File drop via SFTP to Lead"**.
4. Botón **"Generate SFTP Credentials to Provide Lead Sources"**.

Esto entrega:

| Dato | Uso |
|---|---|
| **Host** | Servidor SFTP de DealerCenter donde se depositan los archivos |
| **Port** | Puerto del servidor |
| **Username** | Usuario de la sesión SFTP |
| **Password** | Contraseña de la sesión SFTP |
| **Directory** | Carpeta donde se deben subir los archivos ADF |

> [!important] Acción pendiente
> Alguien con acceso admin a DealerCenter (Jorge o Karel) tiene que entrar y generar estas credenciales. Nosotros no las tenemos todavía — no se pueden inventar ni asumir.

## 3. Requisito clave: DCID como Vendor ID

El archivo ADF/XML que se sube **debe incluir el tag `<vendor><id source="dealerId">`** con el **DCID (DealerCenter Company ID)** del dealer como valor. Sin este dato, DealerCenter no puede asociar el lead a la cuenta correcta.

- El DCID se encuentra en DealerCenter bajo **Dealer Setting → Dealer Profile Settings**.
- Con 3 subcuentas GHL (Carwarriors LLC, Car Express Servicess, Rances Car) hay que confirmar si las 3 comparten un solo DCID en DealerCenter o si cada una tiene su propio DCID — esto define si se necesita un mapeo de "subcuenta GHL → DCID" antes de generar el XML.

> [!success] Resuelto 2026-07-22 (audio de Bianca Cangialosi)
> **Un solo DCID para todo el ecosistema** (14031841, ya confirmado en [[Carwarriors LLC]]). Rances Car y Carwarriors LLC comparten la misma cuenta DealerCenter — no hay mapeo "subcuenta GHL → DCID" que construir. La distinción entre dealers se hace dentro de DealerCenter con el campo **Lead Source** (convención de nombre con sufijo por dealer: `Trade-In CW` vs `Rances Trade-In`, `Tesla CW` vs `Tesla Rances`, `previous customer`, etc.) combinado con **Lead Type** (`Internet` por defecto para redes sociales/campañas, `Phone`, `Chat`, `Walk-in`). Esto sí introduce un requisito nuevo para el XML: falta confirmar qué tag ADF puebla estos dos campos nativos de DealerCenter (ver sección 4).

## 4. Formato ADF/XML — qué es y estructura

ADF (**A**uto-lead **D**ata **F**ormat) es el estándar abierto que usan prácticamente todos los CRMs automotrices (DealerCenter, VinSolutions, eLead, DealerTeam, etc.) para intercambiar leads. Es XML plano, sin autenticación embebida — la seguridad la da el canal (SFTP) y el `vendor id`.

Fuentes de referencia:
- [ADF XML Info](https://adfxml.info/) — sitio de referencia del estándar (spec ADF 1.0 en PDF)
- [Calldrip — Rest ADF/XML API, ejemplo completo](https://app.calldrip.com/developer/1.0/receiving/adf_xml)
- [Selly Automotive — XML ADF, el formato universal](https://sellyautomotive.zendesk.com/hc/en-us/articles/360054112251-XML-ADF-The-universal-format-ALL-automotive-CRM-s-process-leads)

### Ejemplo de payload mínimo viable (adaptado para Carwarriors)

```xml
<?xml version="1.0"?>
<?adf version="1.0"?>
<adf>
  <prospect>
    <id sequence="1" source="ghl-contact-id">CONTACT_ID_DE_GHL</id>
    <requestdate>2026-07-08T14:30:00</requestdate>
    <requesttype>sales</requesttype>

    <vehicle status="used" interest="buy">
      <!-- Opcional en la primera versión: solo si el lead ya mostró interés en un auto específico -->
      <year>2018</year>
      <make>Ford</make>
      <model>Focus</model>
    </vehicle>

    <customer>
      <contact>
        <name part="full">NOMBRE_DEL_LEAD</name>
        <email>EMAIL_SI_EXISTE</email>
        <phone type="voice">TELEFONO_DEL_LEAD</phone>
      </contact>
    </customer>

    <vendor>
      <id sequence="1" source="dealerId">DCID_DE_DEALERCENTER</id>
      <vendorname>Carwarriors LLC</vendorname>
    </vendor>

    <provider>
      <id sequence="1" source="sourcename">GoHighLevel</id>
      <name part="full">Carwarriors LLC - GHL</name>
      <service>WhatsApp / Instagram / Messenger</service>
    </provider>
  </prospect>
</adf>
```

**Campos obligatorios según el estándar:** `requestdate` (ISO 8601, sin milisegundos ni zona horaria en el ejemplo de referencia) y al menos un dato de contacto del `customer`. El bloque `vehicle` es requerido por el estándar pero puede ir vacío/genérico si el lead aún no mostró interés en un auto puntual — a confirmar si DealerCenter lo exige poblado o acepta placeholder.

> [!success] RESUELTO 2026-07-23 — mapeo de Lead Type / Lead Source confirmado
> Se probó con 2 XML reales subidos por SFTP: `<provider><name part="full">Trade-In CW</name></provider>` **sin** el sub-tag `<service>` produjo un Lead Source **exacto** "Trade-In CW" en DealerCenter (coincidiendo con el valor real del dropdown del equipo, no como texto libre). Si se incluye `<service>`, DealerCenter concatena "NAME - SERVICE" en mayúsculas, arruinando el match limpio — por eso el XML de producción debe omitir `<service>`. **Lead Type no se mapea desde ningún tag ADF probado**: quedó fijo en "Internet" en ambas pruebas, consistente con que Internet es el default de DealerCenter para cualquier lead social/campaña (el 100% de lo que manda este workflow). Queda pendiente levantar la tabla completa de valores de Lead Source por campaña/dealer con Jorge/Bianca (ver sección 4 y [[Carwarriors LLC]]).

**Convención de nombre de archivo:** no confirmado para DealerCenter específicamente — es común en integraciones ADF/SFTP usar `[timestamp]_[contactId].xml` o `.adf.xml` para que el proceso de importación en el otro lado identifique archivos nuevos y no reprocese los ya importados. Hay que confirmarlo cuando se generen las credenciales (a veces el proveedor especifica una convención o un directorio de "procesados").

## 5. n8n vs Cloudflare Worker para este tramo — datos para decidir después

No se decide aquí, pero se deja la comparación con datos reales:

| Criterio | n8n (nodo FTP, protocolo SFTP) | Cloudflare Worker |
|---|---|---|
| Disponibilidad | n8n trae un nodo **FTP** nativo con modo SFTP (subida de archivo por conexión SFTP estándar) — no requiere desarrollo custom | Requiere escribir el conector a mano (fetch + librería SFTP para edge, ej. `ssh2-sftp-client` no corre nativo en Workers — normalmente se usa un servicio intermedio o una librería SFTP compatible con edge runtime) |
| Costo variable | Ninguno adicional — ya está pagado el VPS | Ninguno en el free tier de Cloudflare Workers para volumen bajo |
| Centralización | Todo el pipeline (webhook GHL → agente IA → guardado Mongo → armado XML → SFTP) queda en un solo lugar (n8n), más fácil de debuggear y dar mantenimiento | El Worker queda aislado del resto del pipeline — hay que mantener dos sistemas separados y sincronizar lógica (ej. reintentos, logs) |
| Complejidad de implementación SFTP sobre edge | N/A | Cloudflare Workers no tiene soporte nativo para sockets TCP crudos necesarios para SFTP (usa Workers Sockets API, en beta/limitado) — riesgo técnico más alto de lo que se pensó originalmente |
| Reintentos / colas | n8n permite reintentos, error workflows y Redis ya está en el stack para esto | Hay que construir manejo de reintentos a mano |

> [!important] Hallazgo relevante
> El registro anterior en `Carwarriors LLC.md` daba el Cloudflare Worker como "solución adoptada" asumiendo que sería más simple. La investigación muestra que SFTP real (sockets TCP persistentes) es **difícil de implementar en el runtime de Cloudflare Workers** (no es fetch/HTTP, es un protocolo con handshake y sesión). n8n, en cambio, trae soporte SFTP nativo listo para usar. Esto inclina la balanza técnica hacia n8n para este tramo específico — pendiente de decisión final del usuario, pero es el dato que faltaba.

## 6. Alternativa detectada: API no oficial de terceros (Supergood)

Se encontró un proveedor externo, **Supergood**, que ofrece una **API no oficial** de DealerCenter (ingeniería inversa del flujo autenticado del navegador), permitiendo leer inventario/leads/deals y **escribir leads, quotes, credit apps y pagos** directamente, sin pasar por SFTP/ADF.

- [DealerCenter DMS API | Supergood](https://supergood.ai/docs/dealercenter-dms-api)

> [!warning] No recomendado como primera opción
> Es un servicio de pago de un tercero que depende de mantener vigente un login "hackeado" al portal de DealerCenter — riesgo de romperse si DealerCenter cambia su UI, y expone credenciales del cliente a un intermediario adicional. Se deja documentado como **plan B** si el camino SFTP/ADF resulta bloqueado por falta de cooperación o datos de DealerCenter, no como recomendación actual.

## 7. Qué falta para poder implementar (bloqueadores reales)

- [x] Que Jorge o Karel generen las credenciales SFTP desde DealerCenter (Dealer Settings → Customer → Lead Management → Generate SFTP Credentials). -> Hecho 2026-07-22.
- [x] Confirmar el DCID de cada subcuenta (¿una sola cuenta DealerCenter para las 3 subcuentas GHL, o una por dealer?). -> **Una sola cuenta/DCID (14031841) para las 3 subcuentas**, confirmado por Bianca 2026-07-22.
- [ ] Confirmar si DealerCenter exige el bloque `<vehicle>` poblado o acepta un lead sin interés de vehículo específico (común en leads de primer contacto por redes sociales).
- [ ] Confirmar convención de nombre de archivo y si hay una carpeta de "procesados"/logs de error que DealerCenter deje ver.
- [ ] Decidir con el usuario: construir el armado de XML + subida SFTP dentro del mismo workflow n8n del agente de captura de leads, o como workflow separado.
- [x] ~~Confirmar el tag ADF exacto que puebla Lead Type y Lead Source~~ → **RESUELTO 2026-07-23** (ver sección 4). Sigue pendiente levantar la tabla de valores de Lead Source por campaña/dealer con Jorge/Bianca — bloqueador humano, no técnico.
- [ ] Acceso al n8n real del cliente para construir e importar el workflow (no confirmado todavía si existe una instancia n8n propia del cliente o si se usa la de FORJADO).

## 8. Diseño del workflow n8n (borrador, sin construir — falta acceso a n8n + tabla de Lead Source)

Patrón: **Webhook Processing** (trigger de GHL) con salida vía protocolo SFTP en vez de HTTP.

```
1. Webhook (GHL Workflow Action → HTTP Request/Webhook, POST)
   - Recibe: datos de contacto (nombre, email, teléfono) + un campo que identifique
     la campaña/canal de origen (ej. "campaignKey": "trade-in-cw") — este campo lo
     tiene que setear la automatización de GHL antes de llamar al webhook, según de
     qué workflow/tag vino el lead.

2. Set/Code — "Mapear Lead Source"
   - Tabla de mapeo campaignKey → valor exacto de Lead Source (la tabla pendiente
     de Jorge/Bianca). Ej.: "trade-in-cw" -> "Trade-In CW", "rances-trade-in" ->
     "Rances Trade-In", "tesla-cw" -> "Tesla CW", etc.
   - Si campaignKey no matchea ninguna entrada conocida: fallback explícito (¿usar
     un valor genérico como "GHL - Sin Categoría" o fallar el workflow y avisar?
     — decisión de negocio pendiente, no asumir).

3. Code — "Armar XML ADF"
   - Interpola los datos del contacto + DCID fijo (14031841) + el Lead Source
     mapeado en <provider><name part="full">VALOR</name></provider> — SIN <service>.
   - <requestdate> en ISO 8601 sin milisegundos/zona (formato validado en la prueba).
   - <vehicle> puede ir con placeholder genérico si no hay interés en un auto puntual
     (no confirmado si DealerCenter lo exige poblado — no bloqueante, ya se probó
     poblado y funcionó).

4. FTP node (protocolo SFTP) — "Subir a DealerCenter"
   - Host: dccrmleadsprod.blob.core.windows.net, puerto 22, directorio /Leads/,
     credenciales ya guardadas arriba en Carwarriors LLC.md.
   - Nombre de archivo único (timestamp + contact id) para evitar colisiones.

5. Error handling
   - Si el SFTP falla (como pasó con el `close remote: Failure` de la prueba
     interrumpida), el lead se pierde silenciosamente si no hay manejo de error.
     Agregar rama de error → notificación (Slack/email) con el payload original
     para poder reintentar manualmente.
```

**Bloqueadores para construir esto de verdad:**
- Acceso a una instancia n8n para Carwarriors (confirmar cuál usar).
- Tabla completa de Lead Source por campaña/dealer (Jorge/Bianca).
- Definir en GHL cómo cada automatización/tag setea el `campaignKey` que dispara el webhook — esto no se ha diseñado del lado de GHL todavía, solo del lado de DealerCenter.

## Relacionado

- [[Carwarriors LLC]]
- [[Carwarriors - Infraestructura (Diseño)]]
