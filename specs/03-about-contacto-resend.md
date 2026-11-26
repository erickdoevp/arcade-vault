# SPEC 03 — Página «Acerca de» y formulario de contacto con Resend

> **Estado:** Aprobada
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-11-25
> **Objetivo:** Portar `references/templates/home-about/about.jsx` a la ruta `/about`, idéntica a `arcade-vault-standalone.html`, y hacer que su formulario de contacto envíe un correo real al equipo mediante Resend desde una Server Action.

---

## Por qué existe esta spec

SPEC 02 dejó fuera la página «Acerca de» y su enlace en el nav. La plantilla `home-about` la incluye con un formulario de contacto que, en el prototipo, solo simula el envío. Esta spec porta la pantalla tal cual y conecta el formulario a Resend, que es la primera integración con un servicio externo y la primera variable de entorno del proyecto.

Referencias:

- `references/templates/home-about/arcade-vault-standalone.html`: el resultado visual esperado (pantalla «Acerca de»).
- `references/templates/home-about/about.jsx`: estructura, textos, iconos y comportamiento del formulario.
- `references/templates/home-about/styles.css`: estilos en el bloque `/* ===== ABOUT PAGE ===== */` (líneas ~1071–1146).
- `references/templates/home-about/nav.jsx`: el enlace «Acerca de» en escritorio y en el panel móvil.

---

## Alcance

**Entra:**

- `/about` muestra la página con estas partes, en este orden y con los textos literales de `about.jsx`:
  1. **Hero**: kicker `▸ ACERCA DE` (amarillo), título `ACERCA DE ARCADE VAULT`, párrafo de misión y 3 highlights con icono pixel (`HEART` magenta, `BROWSER` cian, `PLANT` verde) y sus `transitionDelay` de 0 / 80 / 160 ms.
  2. **Divisor**: dos barras con degradado magenta y 24 píxeles parpadeantes (`pxblink`, delay `i * 80` ms; cada 3.º magenta, cada 5.º amarillo). Decorativo (`aria-hidden`).
  3. **Contacto**: columna de introducción (kicker `▸ CONTACTO`, título `CONTÁCTANOS`, subtítulo y 3 tips con LED verde / amarillo / magenta) y columna con el formulario (`NOMBRE`, `CORREO ELECTRÓNICO`, `MENSAJE`, botón `▶  ENVIAR MENSAJE` a ancho completo).
- El divisor y la sección de contacto llevan `.reveal` y aparecen al entrar en pantalla, reutilizando `RevealObserver` de SPEC 02.
- Con `prefers-reduced-motion: reduce`: el divisor no parpadea, el formulario no hace shake y el loader del botón no gira/parpadea (queda estático).
- **Formulario de contacto:**
  - Validación en cliente igual que la plantilla: si algún campo está vacío tras `trim`, el formulario hace `shake` (400 ms) y no se envía. El input de correo es `type="email"` (validación nativa del navegador, como la plantilla).
  - El envío usa una Server Action (`sendContactMessage`) con `useActionState`.
  - **Pending:** mientras la acción está en curso, el botón queda `disabled` y muestra un loader pixel (3 bloques cian que parpadean en secuencia) seguido del texto `TRANSMITIENDO…`. Los campos quedan `readOnly`.
  - **Éxito:** se sustituye el formulario por la terminal de la plantilla (`VAULT-OS // TERMINAL`, líneas `[OK]` y `> MENSAJE RECIBIDO. TE RESPONDEREMOS PRONTO. GRACIAS, <NOMBRE EN MAYÚSCULAS>.` con caret parpadeante). `ENVIAR OTRO MENSAJE` vuelve al formulario vacío.
  - **Error:** se muestra la misma terminal en modo error (ver «Estados del formulario»). `REINTENTAR` vuelve al formulario **conservando** lo escrito.
- **Server Action:**
  - Revalida en servidor con `validateContact` (manual, sin dependencias): campos requeridos tras `trim`, formato de correo, longitudes máximas.
  - Honeypot: un campo oculto `website`. Si llega con valor, la acción devuelve éxito sin llamar a Resend.
  - Envía **un único** correo al equipo con el SDK `resend`, en texto plano:
    - `from`: `CONTACT_FROM_EMAIL` (por defecto `Arcade Vault <onboarding@resend.dev>`).
    - `to`: `CONTACT_TO_EMAIL`.
    - `replyTo`: el correo que escribió el usuario.
    - `subject`: `[Arcade Vault] Mensaje de <nombre>`.
    - `text`: nombre, correo y mensaje (formato en «Modelo de datos»).
  - Si falta `RESEND_API_KEY` o `CONTACT_TO_EMAIL`, o Resend devuelve error, la acción registra el detalle con `console.error` en el servidor y devuelve un error genérico al cliente. Nunca expone la API key ni el error crudo de Resend.
- **Nav:** se añade `Acerca de` → `/about` después de `Salón de la Fama`, en escritorio y en el panel móvil. Está activo solo en `/about`.
- **Configuración:** dependencia `resend` en `package.json`; las tres variables de entorno documentadas en `README.md` (sección «Variables de entorno»). Los valores reales viven en `.env.local`, ya ignorado por `.gitignore`.
- Estilos con el mismo enfoque híbrido de Tailwind que SPEC 01/02.

**Fuera de alcance (para specs futuras):**

- Correo de confirmación al usuario que escribe.
- Plantilla HTML o React Email para el correo.
- Rate limiting, CAPTCHA o cualquier anti-spam distinto del honeypot y los límites de longitud.
- Guardar los mensajes en una base de datos o panel de administración.
- Verificación de dominio propio en Resend (configuración de cuenta, no de código).
- Prefijar el formulario con el nombre/correo del usuario en sesión.
- Errores de validación por campo (junto a cada input).
- Tests automatizados.

---

## Modelo de datos

Archivo nuevo: `lib/contact.ts` (sin `"use server"`; lo importan cliente y servidor).

```ts
export const CONTACT_LIMITS = {
  name: 60,
  email: 120,
  message: 2000,
} as const;

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactState =
  | { status: "idle" }
  | { status: "success"; name: string }          // name ya recortado; la UI lo pasa a mayúsculas
  | { status: "error"; reason: "validation" | "send"; detail: string };

/** Recorta y valida. Devuelve los datos limpios o el primer error en español. */
export function validateContact(
  raw: ContactInput,
): { ok: true; data: ContactInput } | { ok: false; detail: string };
```

- Regex de correo: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- Mensajes de `detail` para `validation` (texto en mayúsculas, estilo terminal):
  - `FALTAN CAMPOS OBLIGATORIOS`
  - `CORREO ELECTRÓNICO NO VÁLIDO`
  - `NOMBRE DEMASIADO LARGO (MÁX. 60)` / `CORREO DEMASIADO LARGO (MÁX. 120)` / `MENSAJE DEMASIADO LARGO (MÁX. 2000)`
- `detail` para `send`: siempre `NO SE PUDO TRANSMITIR EL MENSAJE. INTÉNTALO DE NUEVO.`
- Los inputs llevan `maxLength` con los mismos límites.

Highlights del hero, en `lib/about.ts`:

```ts
import type { NeonColor } from "@/lib/games";

export type Highlight = {
  icon: "HEART" | "BROWSER" | "PLANT";
  text: string;               // "HECHO CON ❤️ PARA JUGADORES"
  color: Extract<NeonColor, "cyan" | "magenta" | "green">;
};

export const HIGHLIGHTS: Highlight[]; // 3, copiados de about.jsx
```

Variables de entorno (servidor, nunca `NEXT_PUBLIC_`):

| Variable | Obligatoria | Ejemplo |
| --- | --- | --- |
| `RESEND_API_KEY` | Sí | `re_xxxxxxxx` |
| `CONTACT_TO_EMAIL` | Sí | correo del equipo |
| `CONTACT_FROM_EMAIL` | No | `Arcade Vault <onboarding@resend.dev>` (valor por defecto) |

Cuerpo del correo (`text`):

```
Nuevo mensaje desde el formulario de contacto de Arcade Vault

Nombre: <name>
Correo: <email>

Mensaje:
<message>
```

---

## Estados del formulario

| Estado | UI |
| --- | --- |
| `idle` | Formulario de la plantilla. |
| pending (`isPending`) | Botón `disabled` con loader pixel + `TRANSMITIENDO…`; campos `readOnly`. |
| `success` | Terminal verde de la plantilla, literal. Botón `ENVIAR OTRO MENSAJE` → formulario vacío. |
| `error` | Terminal con borde y sombra magenta. Líneas: `vault@arcade:~$ ./send_message --to=team`, `[OK] Conectando con servidor…` (dim), y una línea `[ERR] <detail>` en magenta, seguida de `> TRANSMISIÓN FALLIDA.` con caret. Botón `REINTENTAR` → formulario con los valores escritos. |

Para volver de `success`/`error` al formulario, el componente cliente guarda los valores en estado local y oculta la terminal con un flag local (no hace falta resetear el estado de la acción).

---

## Archivos

**Nuevos:**

- `app/about/page.tsx`: renderiza `<About />` y define `metadata` (título «Acerca de · Arcade Vault»).
- `app/about/actions.ts`: `"use server"`; `sendContactMessage(prev: ContactState, formData: FormData): Promise<ContactState>`.
- `lib/contact.ts`: tipos, límites y `validateContact`.
- `lib/about.ts`: `HIGHLIGHTS`.
- `components/about.tsx`: Server Component con hero, divisor y sección de contacto; monta `<RevealObserver />` al final.
- `components/highlight-icon.tsx`: los 3 iconos pixel (`HEART`, `BROWSER`, `PLANT`), `aria-hidden`.
- `components/contact-form.tsx`: Client Component con el formulario, shake, pending, terminal de éxito y de error.

**Modificados:**

- `components/nav.tsx`: sección `about`, enlace `Acerca de` (escritorio y móvil) y `activeSection` con `/about` → `about`.
- `app/globals.css`: `@keyframes pxblink` y `@keyframes shake`, los colores por `nth-child` de `.div-pixels`, el loader del botón y su bloque de `prefers-reduced-motion`.
- `package.json` / `package-lock.json`: dependencia `resend`.
- `README.md`: sección «Variables de entorno» con la tabla anterior y el aviso de que `onboarding@resend.dev` solo entrega al correo dueño de la cuenta de Resend.

---

## Plan de implementación

1. **Ruta y nav.** Crear `app/about/page.tsx` con un placeholder y añadir `Acerca de` al nav. Verificación: `/about` carga; `Acerca de` está activo solo ahí; `npm run build` pasa.
2. **Datos y validación.** Crear `lib/about.ts` y `lib/contact.ts`. Verificación: `npm run build` pasa.
3. **CSS base.** Añadir a `globals.css` `pxblink`, `shake`, los `nth-child` del divisor, el loader y el bloque reduced-motion. Verificación: `npm run build` pasa.
4. **Hero + divisor.** Crear `highlight-icon.tsx` y `components/about.tsx` con hero y divisor. Migrar `.about-hero`, `.about-title`, `.about-mission`, `.highlight-row`, `.highlight*`, `.hl-*`, `.about-divider`, `.div-bar` y `.div-pixels` a Tailwind (breakpoint 820 px para los highlights). Verificación: coincide con el standalone a 1440 px.
5. **Contacto (solo UI).** Crear `contact-form.tsx` con el formulario, el shake de validación cliente y la terminal de éxito simulada como en la plantilla. Migrar `.about-contact`, `.contact-*`, `.tip*`, `.field`, `.terminal-success`, `.term-*` a Tailwind (breakpoint 900 px). Montar `RevealObserver`. Verificación: la pantalla completa coincide con el standalone; campos vacíos → shake.
6. **Resend.** `npm install resend`. Crear `app/about/actions.ts` con validación, honeypot, lectura de env y envío. Leer antes la guía de Server Actions / Forms en `node_modules/next/dist/docs/`. Verificación: `npm run build` pasa.
7. **Conectar el formulario.** Sustituir la simulación por `useActionState(sendContactMessage, { status: "idle" })`; añadir honeypot, `maxLength`, pending con loader, terminal de error y `REINTENTAR`. Verificación: con `.env.local` válido llega el correo; sin `RESEND_API_KEY` se ve la terminal de error.
8. **Documentación.** Sección «Variables de entorno» en `README.md`.
9. **Limpieza.** `npm run lint`, `npm run build` y `grep` de que cada clase nueva de `globals.css` se usa en algún `.tsx`.

---

## Criterios de aceptación

- [ ] `npm run build` termina sin errores.
- [ ] `npm run lint` termina sin errores.
- [ ] `/about` muestra hero, divisor y contacto con los textos literales de `about.jsx`.
- [ ] A 1440 px, `/about` coincide visualmente con la pantalla «Acerca de» de `arcade-vault-standalone.html` en capturas lado a lado.
- [ ] A 375 px no hay scroll horizontal en `/about`; los highlights y la rejilla de contacto quedan en 1 columna.
- [ ] El divisor muestra 24 píxeles parpadeando con colores cian / magenta (cada 3.º) / amarillo (cada 5.º).
- [ ] Divisor y contacto empiezan invisibles y aparecen al entrar en pantalla; con reduced-motion emulado son visibles y el divisor no parpadea.
- [ ] El nav muestra `Acerca de` tras `Salón de la Fama` en escritorio y en el panel móvil, activo solo en `/about`.
- [ ] Enviar con algún campo vacío (o solo espacios) provoca shake y **no** dispara ninguna petición al servidor.
- [ ] Durante el envío el botón está deshabilitado, muestra el loader y `TRANSMITIENDO…`, y los campos no se pueden editar.
- [ ] Con `.env.local` válido, enviar el formulario entrega un correo a `CONTACT_TO_EMAIL` con asunto `[Arcade Vault] Mensaje de <nombre>`, cuerpo en texto plano y `Reply-To` igual al correo introducido.
- [ ] Tras un envío correcto se ve la terminal de éxito con `GRACIAS, <NOMBRE>.` en mayúsculas; `ENVIAR OTRO MENSAJE` deja el formulario vacío.
- [ ] Sin `RESEND_API_KEY` se ve la terminal de error con `[ERR] NO SE PUDO TRANSMITIR EL MENSAJE. INTÉNTALO DE NUEVO.`; `REINTENTAR` devuelve el formulario con los valores escritos; el servidor registra el motivo con `console.error`.
- [ ] Una petición a la acción con un correo inválido o un mensaje de más de 2000 caracteres devuelve `reason: "validation"` y no llama a Resend.
- [ ] Una petición con el honeypot `website` relleno devuelve éxito y no llama a Resend.
- [ ] La API key no aparece en el bundle del cliente (`grep -r "RESEND_API_KEY" .next/static` sin resultados).
- [ ] `README.md` documenta las tres variables de entorno.
- [ ] La consola del navegador no muestra errores ni warnings de hidratación en `/about`.
- [ ] Ninguna clase añadida a `globals.css` queda sin uso en `app/` o `components/`.

---

## Decisiones

- **Sí:** ruta `/about`. Sigue la convención de nombres en inglés de SPEC 01 (`/games`, `/hall-of-fame`, `/login`).
- **Sí:** Server Action con `useActionState`. Sin endpoint público, pending nativo y menos código.
- **No:** Route Handler `POST /api/contact`. Solo aporta valor si otro cliente consume el endpoint, y hoy no existe.
- **Sí:** destinatario y remitente en variables de entorno, `Reply-To` con el correo del usuario. Permite cambiar destino o verificar dominio sin tocar código, y el equipo responde directamente desde su cliente.
- **No:** destinatario fijo en código.
- **Sí:** validación manual en `lib/contact.ts`. Tres campos no justifican una dependencia.
- **No:** Zod.
- **Sí:** validación doble: la de la plantilla en cliente (shake) y `validateContact` en servidor. El cliente no es de fiar.
- **Sí:** correo en texto plano. Sin riesgo de inyección HTML y sin dependencias.
- **No:** HTML ni React Email.
- **No:** correo de confirmación al usuario. Con `onboarding@resend.dev` solo se entrega al dueño de la cuenta, y duplicaría la superficie de abuso.
- **Sí:** honeypot + límites de longitud como única defensa anti-spam. Fallo silencioso (éxito falso) para no dar pistas a los bots.
- **No:** rate limiting en memoria. No es fiable en serverless; si hace falta, irá en otra spec con un almacén real.
- **Sí:** terminal en modo error para cualquier fallo, conservando los datos al reintentar. Mantiene la estética de la plantilla y no hace perder el mensaje escrito.
- **Sí:** error genérico al cliente y detalle en `console.error`. No filtra configuración ni respuestas de Resend.
- **Sí:** botón deshabilitado con loader pixel durante el envío. Evita dobles envíos y da feedback inmediato.
- **Sí:** `About` como Server Component con un único `ContactForm` cliente y el `RevealObserver` ya existente.
- **Sí:** Tailwind híbrido, como SPEC 01/02: en `globals.css` quedan `@keyframes`, los `nth-child` del divisor y el loader; el resto pasa a utilidades.
- **Sí:** documentar variables en `README.md`. `.gitignore` ignora `.env*`, así que un `.env.example` no se versionaría sin tocar `.gitignore`.

---

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Con `onboarding@resend.dev` Resend solo entrega al correo dueño de la cuenta; si `CONTACT_TO_EMAIL` es otro, el envío falla. | Avisarlo en `README.md`. Para producción, verificar dominio y fijar `CONTACT_FROM_EMAIL`. |
| La API de Server Actions / `useActionState` difiere en Next 16 respecto a versiones anteriores. | Leer la guía correspondiente en `node_modules/next/dist/docs/` antes del paso 6, como exige `AGENTS.md`. |
| `cacheComponents` intenta prerenderizar `/about` y algo dinámico rompe el build. | La página es estática; la lectura de env y la llamada a Resend ocurren solo dentro de la acción. Verificar con `npm run build` en el paso 6. |
| El cliente de Resend instanciado a nivel de módulo falla en build si falta la key. | Instanciar `new Resend(key)` dentro de la acción, tras comprobar que la key existe. |
| Se filtra la API key al cliente. | Variables sin prefijo `NEXT_PUBLIC_`, usadas solo en `actions.ts`; criterio de aceptación con `grep` sobre `.next/static`. |
| El shake y `.reveal` dejan contenido oculto sin JS. | Mismo tratamiento que SPEC 02 (reduced-motion visible). |

---

## Lo que **no** entra en esta spec

- Correo de confirmación al usuario.
- Correo en HTML / React Email.
- Rate limiting, CAPTCHA.
- Persistencia de mensajes.
- Verificación de dominio en Resend.
- Prefijado del formulario con el usuario en sesión.
- Errores por campo.
- Tests automatizados.

Cada uno, si llega, va en su propia spec.
