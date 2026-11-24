# SPEC 02 — Landing de inicio y Biblioteca en `/games`

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-23
> **Objetivo:** Portar la landing de `references/templates/home-about/home.jsx` a la ruta `/`, idéntica a `arcade-vault-standalone.html`, y mover la Biblioteca de `/` a `/games`.

---

## Por qué existe esta spec

La plantilla `home-about` añade una landing como pantalla de inicio de la plataforma. En SPEC 01 la Biblioteca ocupaba `/`. Esta spec pone la landing en `/` y mueve la Biblioteca a `/games`. Así `/games` lista los juegos y `/games/[id]` muestra uno, que es una jerarquía de URLs coherente. Cambiar la ruta de la Biblioteca obliga a revisar todos los enlaces que hoy apuntan a `/`.

Referencias (idénticas byte a byte a las de `~/Downloads/home-about/`):

- `references/templates/home-about/arcade-vault-standalone.html`: el resultado visual esperado.
- `references/templates/home-about/home.jsx`: estructura, textos y datos de la landing.
- `references/templates/home-about/styles.css`: estilos de la landing, en el bloque `/* ===== HOME PAGE ===== */`.
- `references/templates/home-about/nav.jsx`: el enlace «Inicio» del nav.

---

## Alcance

**Entra:**

- `/` muestra la landing con las siete secciones de `home.jsx`, en este orden:
  1. **Hero**: 8 siluetas pixel flotantes, el eyebrow `▸ INSERTA UNA MONEDA_` con cursor parpadeante y el título en 3 líneas (`EL ARCADE` blanco, `CLÁSICO ESTÁ` con degradado cian, `DE VUELTA` con degradado magenta). Debajo, el subtítulo, los CTAs `▶  EXPLORAR JUEGOS` (con pulse) y `✦  CREAR CUENTA` (magenta) y el indicador `DESLIZA ▼` con rebote.
  2. **`// 01 ¿POR QUÉ ARCADE VAULT?`**: 4 feature cards (GAMEPAD cian, FREE amarillo, TROPHY magenta, ROCKET verde) con iconos SVG pixel.
  3. **`// 02 JUEGOS DISPONIBLES AHORA`**: mini-rail con los 6 primeros `GAMES` y el botón `VER TODOS LOS JUEGOS →`.
  4. **Stats**: 3 bloques (`12+ JUEGOS`, `MILES DE PARTIDAS`, `GLOBAL RANKING`).
  5. **`// 03 ACTIVIDAD EN VIVO`**: el ticker `▸ ÚLTIMAS PUNTUACIONES` (7 filas) y `▸ TOP JUGADORES · HOY` (5 filas con barra) con el enlace `VER SALÓN →`.
  6. **`// 04 PRECIOS`**: la tarjeta `JUGADOR VAULT $0 / SIEMPRE` con 6 ítems, el botón `EMPEZAR GRATIS →` y el sello `FREE PLAY`, más 3 FAQ.
  7. **CTA final**: `¿LISTO PARA JUGAR?`, el botón `INSERTAR MONEDA →` y la línea de cierre.
- Las secciones 2 a 7 aparecen al entrar en pantalla (`.reveal` → `.in` con `IntersectionObserver`, umbral 0.12). Mantienen los `transitionDelay` escalonados de la plantilla.
- Con `prefers-reduced-motion: reduce`:
  - Las secciones `.reveal` se muestran visibles desde el inicio.
  - Las siluetas no flotan.
  - La flecha `▼` no rebota.
- Los textos son idénticos a `home.jsx`, incluidos los números del ticker formateados con `toLocaleString("es-ES")`.
- Navegación de la landing:
  - `EXPLORAR JUEGOS`, `VER TODOS LOS JUEGOS →` e `INSERTAR MONEDA →` → `/games`.
  - `CREAR CUENTA` y `EMPEZAR GRATIS →` → `/login`.
  - Cada mini-card → `/games/<id>`.
  - `VER SALÓN →` → `/hall-of-fame`.
- La Biblioteca de SPEC 01 se mueve de `/` a `/games` sin cambios visuales.
- Nav:
  - Se añade el enlace `Inicio` → `/` delante de `Biblioteca`, en escritorio y en el panel móvil.
  - El logo lleva a `/`.
  - `Inicio` está activo solo en `/`.
  - `Biblioteca` está activo en `/games`, `/games/<id>` y `/games/<id>/play`.
- Enlaces existentes que se reapuntan:
  - `VOLVER AL VAULT` del detalle (`app/games/[id]/page.tsx`) → `/games`.
  - `VOLVER AL VAULT` del modal del reproductor (`components/game-player.tsx`) → `/games`.
  - `VOLVER A LA BIBLIOTECA` del Salón (`components/hall-of-fame.tsx`) → `/games`.
  - Enviar el formulario de login y `JUGAR COMO INVITADO` (`components/auth-form.tsx`) → `/games`.
  - `VOLVER AL VAULT` del 404 (`app/not-found.tsx`) **se queda en `/`**, que ahora es la landing.
- Los estilos se migran con el mismo enfoque híbrido de Tailwind que SPEC 01 (ver Decisiones).

**Fuera de alcance (para specs futuras):**

- La página «Acerca de» (`about.jsx`) y su enlace en el nav.
- Abrir `/login` directamente en la pestaña CREAR CUENTA (p. ej. `?tab=signup`).
- Datos reales en el ticker, el top de jugadores o las stats. Son constantes fijas.
- Corregir los textos de marketing para que cuadren con el catálogo (`12+ JUEGOS` con 8 juegos, la mención de «Arkanoid, Tetris, Snake»).
- Redirecciones de las URLs antiguas (no hay usuarios ni enlaces externos todavía).
- Tests automatizados.

---

## Modelo de datos

Archivo nuevo: `lib/home.ts`. Constantes estáticas copiadas tal cual de `home.jsx`.

```ts
import type { NeonColor } from "@/lib/games";

export type Feature = {
  icon: "GAMEPAD" | "FREE" | "TROPHY" | "ROCKET";
  title: string;       // "JUEGOS CLÁSICOS"
  desc: string;
  color: NeonColor;
};

export type HomeStat = { n: string; u: string; s: string };    // { n: "12+", u: "JUEGOS", s: "Y CONTANDO" }

export type TickerRow = {
  player: string;      // "NEONFOX"
  game: string;        // "Caída"
  score: number;       // 184220
  ago: string;         // "hace 2 min"
  color: NeonColor;
};

export type TopPlayer = { rank: number; player: string; score: number };

export type FaqItem = { q: string; a: string };

export const FEATURES: Feature[];      // 4
export const HOME_STATS: HomeStat[];   // 3
export const TICKER: TickerRow[];      // 7
export const TOP_TODAY: TopPlayer[];   // 5
export const PRICING_ITEMS: string[];  // 6, sin el "✔ " (lo pinta el componente)
export const FAQ: FaqItem[];           // 3
```

- El mini-rail reusa `GAMES.slice(0, 6)` de `lib/games.ts`. No se introducen datos de juegos nuevos.
- Ancho de la barra del top: `100 - i * 16` % (índice 0–4), igual que la plantilla.

---

## Archivos

**Nuevos:**

- `lib/home.ts`: constantes de la landing.
- `components/home.tsx`: Server Component con las siete secciones.
- `components/home-silhouettes.tsx`: las 8 siluetas SVG del hero, decorativas (`aria-hidden`).
- `components/feature-icon.tsx`: los 4 iconos pixel (`GAMEPAD`, `FREE`, `TROPHY`, `ROCKET`).
- `components/mini-card.tsx`: card compacta del mini-rail, un `Link` a `/games/<id>`.
- `components/reveal-observer.tsx`: Client Component sin UI. En `useEffect` observa `.reveal` y añade `.in`, y desconecta el observer al desmontar.
- `app/games/page.tsx`: renderiza `<Library />`.

**Modificados:**

- `app/page.tsx`: pasa de `<Library />` a `<Home />`.
- `components/nav.tsx`: añade la sección `inicio`, el enlace `Inicio` y el nuevo cálculo del estado activo.
- `components/auth-form.tsx`: `router.push("/games")` en los dos casos.
- `app/games/[id]/page.tsx`: `VOLVER AL VAULT` → `/games`.
- `components/game-player.tsx`: `VOLVER AL VAULT` → `/games`.
- `components/hall-of-fame.tsx`: `VOLVER A LA BIBLIOTECA` → `/games`.
- `app/globals.css`: añade los estilos de la landing que no se migran a Tailwind.

---

## Plan de implementación

1. **Mover la Biblioteca.** Crear `app/games/page.tsx` con `<Library />`. Reapuntar a `/games` los enlaces del detalle, del reproductor, del Salón y de `auth-form.tsx`. `app/page.tsx` sigue mostrando la Biblioteca temporalmente. Verificación: `/games` y `/` muestran la Biblioteca; `/games/caida` sigue funcionando; `npm run build` pasa.
2. **Datos.** Crear `lib/home.ts` con los tipos y las constantes copiadas de `home.jsx`. Verificación: `npm run build` pasa.
3. **CSS base de la landing.** Añadir a `globals.css`:
   - `@keyframes float` y `@keyframes bounce`.
   - `.reveal` / `.reveal.in`.
   - `.home-silos` y `.silo.s1`–`.s8` (posiciones, tamaños, colores, delays).
   - Los degradados con `background-clip: text` de `.line-2` y `.line-3`.
   - Un bloque `@media (prefers-reduced-motion: reduce)` que anula `float` y `bounce` y deja `.reveal` visible.

   Verificación: `npm run build` pasa.
4. **Hero.** Crear `home-silhouettes.tsx` y `components/home.tsx` con solo el hero. Cambiar `app/page.tsx` a `<Home />`. Migrar a Tailwind `.home-hero`, `.home-hero-inner`, `.hero-eyebrow`, `.home-title`, `.home-sub`, `.home-ctas` y `.hero-scroll`. Verificación: `/` muestra el hero igual que el standalone; los CTAs navegan a `/games` y `/login`.
5. **Por qué + juegos.** Crear `feature-icon.tsx` y `mini-card.tsx`. Añadir las secciones `// 01` y `// 02` y la cabecera de sección reutilizable (kicker + título + regla). Migrar `.home-section`, `.section-head`, `.kicker`, `.section-title`, `.section-rule`, `.feature-grid`, `.feature-card`, `.ft-*`, `.mini-rail` y `.mini-*` a Tailwind. Las breakpoints son las de la plantilla: 980 / 520 px para features y 1100 / 600 px para el rail. Verificación: la mini-card de CAÍDA navega a `/games/caida`.
6. **Stats + actividad.** Añadir la banda de stats y la sección `// 03`. Migrar `.home-stats`, `.stats-inner`, `.stat-*`, `.activity-grid`, `.activity-card`, `.ac-*`, `.ticker`, `.tick-row`, `.tk-*`, `.top-list`, `.top-row` (top1–3), `.tp-*` y `.lb-link` a Tailwind. Si `.tick-row` usa una animación de entrada propia, su `@keyframes` va a `globals.css`. Verificación: `VER SALÓN →` navega a `/hall-of-fame`.
7. **Precios + CTA final.** Añadir `// 04` y `.home-final`. Migrar `.pricing-grid`, `.price-card`, `.pc-*` (incluido el sello `.pc-stamp`), `.pricing-faq`, `.faq-*`, `.home-final` y `.final-*` a Tailwind. Verificación: `EMPEZAR GRATIS →` navega a `/login`; `INSERTAR MONEDA →` navega a `/games`.
8. **Reveal.** Crear `reveal-observer.tsx`, montarlo dentro de `Home` y poner `reveal` en las secciones 2 a 7. Verificación: al hacer scroll las secciones aparecen con fade + desplazamiento; con reduced-motion emulado aparecen sin animación.
9. **Nav.** Añadir `Inicio` (escritorio y móvil) y el logo → `/`. Actualizar `activeSection`: `/` → `inicio`; `/games` y `/games/*` → `biblioteca`. Verificación: el estado activo es correcto en las 6 rutas.
10. **Limpieza.** Confirmar con `grep` que cada clase añadida a `globals.css` se usa en algún `.tsx`.

---

## Criterios de aceptación

- [x] `npm run build` termina sin errores.
- [x] `npm run lint` termina sin errores.
- [x] `/` muestra la landing.
- [x] `/games` muestra la Biblioteca con las 8 cards, buscador y chips, igual que antes en `/`.
- [x] A 1440 px, la landing en `/` coincide visualmente con `arcade-vault-standalone.html` (pantalla de inicio), sección por sección, en capturas lado a lado.
- [x] A 375 px no hay scroll horizontal en `/`; el mini-rail queda en 2 columnas, las features en 1 y las stats en 1.
- [x] El hero muestra 8 siluetas flotando, el título en 3 líneas con sus degradados y `DESLIZA ▼` rebotando.
- [x] Las secciones 2 a 7 empiezan invisibles y aparecen al entrar en pantalla.
- [x] Con `prefers-reduced-motion: reduce` emulado, todas las secciones son visibles sin hacer scroll, y las siluetas y la flecha están quietas.
- [x] El ticker muestra 7 filas con puntuaciones en formato `es-ES` (`+184.220`).
- [x] El top muestra 5 filas con `#01`–`#05` y barras al 100, 84, 68, 52 y 36 %.
- [x] `EXPLORAR JUEGOS`, `VER TODOS LOS JUEGOS →` e `INSERTAR MONEDA →` navegan a `/games`.
- [x] `CREAR CUENTA` y `EMPEZAR GRATIS →` navegan a `/login`.
- [x] Clic en la mini-card de un juego navega a `/games/<id>`.
- [x] `VER SALÓN →` navega a `/hall-of-fame`.
- [x] El nav muestra `Inicio` antes de `Biblioteca` en escritorio y en el panel móvil.
- [x] `Inicio` está activo solo en `/`.
- [x] `Biblioteca` está activo en `/games`, `/games/<id>` y `/games/<id>/play`, y no en `/`.
- [x] El logo del nav navega a `/`.
- [x] `VOLVER AL VAULT` del detalle y del modal del reproductor navegan a `/games`.
- [x] `VOLVER A LA BIBLIOTECA` del Salón navega a `/games`.
- [x] `VOLVER AL VAULT` del 404 navega a `/`.
- [x] Enviar el login o pulsar `JUGAR COMO INVITADO` navega a `/games`.
- [x] La consola del navegador no muestra errores ni warnings de hidratación en `/` ni en `/games`.
- [x] Ninguna clase añadida a `globals.css` queda sin uso en `app/` o `components/`.

---

## Decisiones

- **Sí:** landing en `/` y Biblioteca en `/games`. `/games` lista y `/games/[id]` detalla, y la landing es la portada natural.
- **No:** landing en `/games` dejando la Biblioteca en `/`. Fue la petición inicial, pero se descartó porque rompe la jerarquía de URLs.
- **No:** servir la landing en dos rutas. Duplica contenido y deja la Biblioteca sin URL clara.
- **Sí:** solo el enlace `Inicio` en el nav. `Acerca de` llega con su propia spec, junto con `about.jsx`.
- **No:** `Acerca de` como enlace muerto. Un enlace sin destino es peor que su ausencia.
- **Sí:** los CTAs navegan a las rutas reales de SPEC 01.
- **No:** abrir `/login` en la pestaña CREAR CUENTA. Obliga a tocar `auth-form.tsx` con un parámetro de búsqueda; queda para otra spec.
- **Sí:** los «volver» se reapuntan según su texto. «Biblioteca» y el «Vault» del detalle y del reproductor van a `/games`. El 404 va a `/`, porque tras un error la portada es el punto de partida.
- **Sí:** después de iniciar sesión se va a `/games`. Conserva el comportamiento de SPEC 01: tras entrar, el usuario ve los juegos.
- **Sí:** Tailwind híbrido, como SPEC 01. En `globals.css` se quedan `@keyframes`, `.reveal`, las siluetas (`.home-silos`, `.silo.s1`–`.s8`) y los degradados de texto del título. El resto pasa a utilidades.
- **No:** copiar el CSS de la plantilla tal cual. Rompe la convención establecida en SPEC 01.
- **Sí:** animaciones idénticas a la plantilla, más `prefers-reduced-motion`. Respeta la accesibilidad sin cambiar la experiencia por defecto.
- **Sí:** `Home` como Server Component, con un único `RevealObserver` cliente. Toda la landing es estática; solo el observer necesita el navegador.
- **No:** un hook `useReveal` dentro de `Home`. Convertiría toda la landing en Client Component sin necesidad.
- **Sí:** mini-cards como `Link`, no `div` con `onClick`. Navegación accesible y con prefetch.
- **Sí:** textos literales de la plantilla, aunque `12+ JUEGOS` y «Arkanoid, Tetris, Snake» no cuadren con el catálogo. El requisito es una pantalla idéntica; corregir el copy es otra decisión.
- **Sí:** datos de la landing en `lib/home.ts`. Separa el contenido mock del marcado, igual que `lib/games.ts`.
- **No:** redirigir las URLs antiguas. El proyecto no tiene usuarios ni enlaces externos.

---

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Con `.reveal` en `opacity: 0`, el contenido queda invisible si el JS no se hidrata. | El bloque reduced-motion cubre a esos usuarios. Si el riesgo pesa, `RevealObserver` puede marcar `<html>` con una clase al montarse, y solo con esa clase `.reveal` parte de opacidad 0. Decidir en el paso 8 sin cambiar el comportamiento visible. |
| `IntersectionObserver` registrado antes de que existan las secciones. | `RevealObserver` se monta dentro de `Home`, después de las secciones, y ejecuta `querySelectorAll` en `useEffect`. Con navegación cliente se vuelve a montar y vuelve a observar. |
| `toLocaleString` produce un hydration mismatch. | Locale fijado a `"es-ES"`, como en SPEC 01. |
| Diferencias visuales al traducir el CSS a Tailwind. | Comparar cada sección lado a lado con `arcade-vault-standalone.html` abierto en el navegador al cerrar cada paso. |
| Queda algún enlace apuntando a `/` cuando debería ir a `/games`. | `grep -rn 'href="/"\|push("/")' app components` al cerrar el paso 1. Solo deben quedar el logo, `Inicio` y el 404. |

---

## Lo que **no** entra en esta spec

- Página «Acerca de» y su enlace.
- Pestaña de registro preseleccionada en `/login`.
- Datos reales en ticker, top y stats.
- Ajustes del copy de marketing.
- Redirecciones de URLs antiguas.
- Tests automatizados.

Cada uno, si llega, va en su propia spec.
