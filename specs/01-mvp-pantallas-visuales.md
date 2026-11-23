# SPEC 01 — MVP visual: pantallas de Arcade Vault

> **Estado:** Implementado
> **Depende de:** —
> **Fecha:** 2026-11-23
> **Objetivo:** Portar a Next.js (App Router + Tailwind) las cinco pantallas de `references/templates/` con datos mock y estado en memoria, sin implementar ningún juego real.

---

## Por qué existe esta spec

Las plantillas de `references/templates/` son un prototipo React-UMD con router por hash, estilos en un CSS monolítico y `localStorage`. El MVP las convierte en rutas reales de Next.js 16. Los estilos de layout pasan a utilidades Tailwind. No se añade backend ni persistencia. Sirve de base visual para specs futuras (auth real, juegos, rankings reales).

---

## Alcance

**Entra:**

- Rutas reales del App Router con nombres en inglés:
  - `/` → Biblioteca (hero, buscador, chips de categoría, grid de juegos, estado "NO HAY RESULTADOS").
  - `/games/[id]` → Detalle del juego (portada, tags, descripción, stat-strip, acciones, leaderboard mock de 10 filas).
  - `/games/[id]/play` → Reproductor simulado (HUD, arena CRT animada, pausa, modal "FIN DEL JUEGO").
  - `/login` → Autenticación (tabs INICIAR SESIÓN / CREAR CUENTA, campos, invitado, botones sociales inertes).
  - `/hall-of-fame` → Salón de la Fama (tabs por juego, podio, tabla de 12 filas, fila "TU MEJOR MARCA" si hay usuario).
- Layout compartido: `Nav` (logo, links con estado activo, contador `CRÉDITOS · 03`, botón de sesión, menú móvil hamburguesa con backdrop) y footer `© 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0`.
- Página 404 temática (`app/not-found.tsx`) para ids de juego inexistentes y rutas desconocidas.
- Datos mock tipados (`GAMES`, `CATS`, `seededScores`) portados desde `data.jsx`.
- Usuario de sesión en un React Context en memoria (se pierde al recargar).
- Simulación completa del reproductor: la puntuación sube sola cada 220 ms, el nivel sube, PAUSA/REANUDAR detiene el contador, FIN abre el modal, GUARDAR PUNTUACIÓN muestra `▸ PUNTUACIÓN GUARDADA_`, JUGAR DE NUEVO reinicia.
- Efecto tilt 3D en las cards de la biblioteca.
- Migración de estilos a Tailwind con enfoque híbrido (ver Decisiones).
- Textos de la UI en español, idénticos a las plantillas.

**Fuera de alcance (para specs futuras):**

- Cualquier juego jugable (lógica, canvas, controles de teclado/táctil).
- Autenticación real, validación de formularios, OAuth Google/GitHub.
- Persistencia (`localStorage`, base de datos, cookies).
- Puntuaciones reales: las guardadas desde el modal no aparecen en ningún ranking.
- Lógica real de créditos/monedas (el contador es texto fijo).
- Menú desplegable de cuenta (el botón con el nombre del usuario cierra sesión directamente, como en la plantilla).
- Tests automatizados (no hay framework configurado).

---

## Modelo de datos

Archivo: `lib/games.ts`. Datos estáticos portados 1:1 desde `references/templates/data.jsx`.

```ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type CategoryFilter = "TODOS" | Category;
export type NeonColor = "cyan" | "magenta" | "green" | "yellow";

export type Game = {
  id: string;          // slug usado en la URL: "bloque-buster", "caida", …
  title: string;
  short: string;
  long: string;
  cat: Category;
  cover: string;       // clase CSS de la portada pixel-art: "cover-bricks", …
  color: NeonColor;
  best: number;
  plays: string;       // "12.4K"
};

export type ScoreRow = { rank: number; name: string; score: number; date: string }; // date "DD/MM/2026"

export const GAMES: Game[];               // los 8 juegos de data.jsx
export const CATS: CategoryFilter[];      // ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]
export function getGame(id: string): Game | undefined;
export function seededScores(seed: number, count?: number): ScoreRow[]; // determinista, mismo algoritmo que data.jsx
```

Archivo: `components/user-provider.tsx` (Client Component).

```ts
type User = { name: string } | null;   // name en mayúsculas, máx. 10 caracteres, "PLAYER1" si vacío
type UserContextValue = { user: User; login: (name: string) => void; logout: () => void };
export function useUser(): UserContextValue;
```

Semillas de rankings (igual que la plantilla, para que los datos sean deterministas):

- Detalle: `seededScores(id.length * 17 + 3, 10)`.
- Salón: `seededScores(id.length * 23 + 7, 12)`.

Formato numérico: `toLocaleString("es-ES")` en todas las puntuaciones.

---

## Archivos

**Nuevos:**

- `lib/games.ts`
- `components/user-provider.tsx`
- `components/nav.tsx` (client: menú móvil y estado activo con `usePathname`)
- `components/footer.tsx`
- `components/button.tsx` (variantes `cyan` por defecto, `magenta`, `yellow`, `ghost`; tamaños `md`, `lg`, `xl`; flag `pulse`)
- `components/game-card.tsx` (client: tilt 3D)
- `components/library.tsx` (client: búsqueda + filtro)
- `components/leaderboard.tsx`
- `components/game-player.tsx` (client: simulación + modal)
- `components/auth-form.tsx` (client)
- `components/hall-of-fame.tsx` (client: tabs)
- `app/games/[id]/page.tsx`
- `app/games/[id]/play/page.tsx`
- `app/login/page.tsx`
- `app/hall-of-fame/page.tsx`
- `app/not-found.tsx`

**Modificados:**

- `app/layout.tsx` — envuelve en `UserProvider`, añade `Nav`, `<main>` y `Footer`.
- `app/page.tsx` — reemplaza el contenido de `create-next-app` por la Biblioteca.
- `app/globals.css` — se eliminan las clases de layout/componentes migradas a Tailwind.

---

## Plan de implementación

1. **Datos.** Crear `lib/games.ts` con tipos, `GAMES`, `CATS`, `getGame` y `seededScores`. Verificación: `npm run build` pasa.
2. **Botón.** Crear `components/button.tsx` con las variantes de `.btn` en Tailwind (incluido el `::before` y los hovers neón). Borrar `.btn*` de `globals.css` cuando no quede ningún uso.
3. **Shell.** Crear `user-provider.tsx`, `nav.tsx` y `footer.tsx`. Integrarlos en `app/layout.tsx`. Crear `app/not-found.tsx` (texto `GAME OVER · 404` y botón VOLVER AL VAULT a `/`). Migrar `.av-nav`, `.av-mobile-*`, `.av-main` a Tailwind. Verificación: cualquier ruta muestra nav + footer; `/xyz` muestra el 404 temático.
4. **Biblioteca.** Crear `game-card.tsx` y `library.tsx`. Reemplazar `app/page.tsx`. Migrar `.av-hero`, `.av-filters`, `.av-search`, `.av-chips`, `.chip`, `.av-grid`, `.card`, `.score-badge` a Tailwind. Las portadas usan las clases `cover-*` de `globals.css`. Verificación: buscar "ser" deja solo SERPENTINA; chip PUZZLE deja solo CAÍDA; "zzz" muestra NO HAY RESULTADOS.
5. **Detalle.** Crear `leaderboard.tsx` y `app/games/[id]/page.tsx` con `generateStaticParams` sobre `GAMES` y `notFound()` si `getGame` devuelve `undefined`. Migrar `.av-detail`, `.detail-*`, `.stat-strip`, `.leaderboard`, `.lb-row` a Tailwind. Verificación: `/games/caida` muestra CAÍDA; `/games/nope` muestra el 404.
6. **Reproductor.** Crear `game-player.tsx` y `app/games/[id]/play/page.tsx` (mismos `generateStaticParams` + `notFound()`). Portar la simulación de `reproductor.jsx`. El nombre inicial es `user.name` o `INVITADO`. Migrar `.av-player`, `.player-hud`, `.hud-*`, `.modal-bd`, `.modal`, `.toast-saved` a Tailwind. CRT, arena y enemigos se quedan en `globals.css`. Verificación: recorrido PAUSA → REANUDAR → FIN → GUARDAR → JUGAR DE NUEVO.
7. **Login.** Crear `auth-form.tsx` y `app/login/page.tsx`. Enviar el formulario llama a `login(usuario)` y navega a `/`. JUGAR COMO INVITADO llama a `logout()` y navega a `/`. Migrar `.av-auth-wrap`, `.auth-*`, `.field`, `.social` a Tailwind. Verificación: tras entrar como `px_kai` el nav muestra `PX_KAI ▾`; pulsarlo vuelve a `Iniciar Sesión`.
8. **Salón de la Fama.** Crear `hall-of-fame.tsx` y `app/hall-of-fame/page.tsx`. Portar podio, tabla y fila "TU MEJOR MARCA" (solo con usuario; rango `8 + (id.length % 4)`, puntuación `rows[5].score - 2400`, fecha `11/05/2026`). Migrar `.av-hall`, `.hall-*`, `.podium*` a Tailwind. Verificación: cambiar de tab cambia podio y tabla.
9. **Limpieza de CSS.** Eliminar de `globals.css` cualquier clase que ya no se referencie. Confirmar con `grep` que cada clase restante se usa en algún `.tsx`.

---

## Criterios de aceptación

- [ ] `npm run build` termina sin errores.
- [ ] `npm run lint` termina sin errores.
- [ ] No queda contenido ni assets de la plantilla de `create-next-app` en `app/page.tsx`.
- [ ] `/` muestra el hero `ARCADE VAULT` con flicker y las 8 cards de juego.
- [ ] Escribir "ser" en el buscador deja una sola card (SERPENTINA).
- [ ] El chip `SHOOTER` deja exactamente INVASORES y ROCAS; el chip activo se ve magenta.
- [ ] Una búsqueda sin coincidencias muestra `NO HAY RESULTADOS`.
- [ ] Mover el ratón sobre una card la inclina en 3D; al salir vuelve a su posición.
- [ ] Clic en una card o en su botón JUGAR navega a `/games/<id>`.
- [ ] `/games/<id>` muestra portada, 4 tags, stat-strip y un leaderboard de 10 filas con top 1–3 diferenciados.
- [ ] `▶ JUGAR AHORA` navega a `/games/<id>/play`; `VOLVER AL VAULT` navega a `/`.
- [ ] `/games/no-existe` y `/games/no-existe/play` muestran el 404 temático.
- [ ] En `/games/<id>/play` la puntuación sube sola; PAUSA la detiene y muestra `EN PAUSA`; REANUDAR la reanuda.
- [ ] FIN abre el modal con la puntuación final; GUARDAR PUNTUACIÓN muestra `▸ PUNTUACIÓN GUARDADA_`.
- [ ] JUGAR DE NUEVO reinicia puntuación a 0, vidas a 3 y nivel a 01; SALIR vuelve a `/games/<id>`.
- [ ] En `/login` el tab CREAR CUENTA añade el campo de correo; INICIAR SESIÓN lo oculta.
- [ ] Enviar el formulario con usuario `px_kai` navega a `/` y el nav muestra `PX_KAI ▾`.
- [ ] Pulsar el botón del usuario en el nav cierra sesión y vuelve a mostrar `Iniciar Sesión`.
- [ ] Recargar la página tras iniciar sesión deja al usuario deslogueado.
- [ ] `/hall-of-fame` muestra podio (02 · 01 · 03) y tabla de 12 filas; cambiar de tab de juego cambia los datos.
- [ ] Con sesión iniciada, el Salón muestra la fila `▸ TU MEJOR MARCA EN <JUEGO>` en amarillo; sin sesión no aparece.
- [ ] El link `Biblioteca` del nav está activo en `/`, `/games/<id>` y `/games/<id>/play`; `Salón de la Fama` lo está en `/hall-of-fame`.
- [ ] A 375 px de ancho no hay scroll horizontal y el botón ≡ abre el panel lateral; clic en el backdrop lo cierra.
- [ ] La consola del navegador no muestra errores ni warnings de hidratación en ninguna de las cinco rutas.
- [ ] Ninguna clase de `globals.css` queda sin uso en `app/` o `components/`.

---

## Decisiones

- **Sí:** rutas reales del App Router en inglés (`/games/[id]`, `/games/[id]/play`, `/login`, `/hall-of-fame`). URLs compartibles y back/forward nativo.
- **No:** replicar el router por hash de la plantilla. Ignora las capacidades del App Router.
- **No:** rutas en español (`/juegos`, `/salon`). Se prefirió inglés en las URLs; los textos de la UI siguen en español.
- **Sí:** simulación completa del reproductor. Permite revisar todos los estados visuales (jugando, pausa, fin, guardado) sin un juego real.
- **Sí:** usuario en React Context en memoria. El MVP es solo visual.
- **No:** `localStorage` como en la plantilla. Se decidió no persistir nada en esta fase.
- **Sí:** GUARDAR PUNTUACIÓN solo muestra la confirmación. Los rankings siguen siendo mock deterministas.
- **No:** insertar las puntuaciones guardadas en el Salón. Requiere persistencia y pertenece a otra spec.
- **Sí:** Tailwind híbrido. Layout, espaciado, tipografía, botones, cards, formularios, tablas y modal se escriben con utilidades. En `globals.css` se quedan tokens, base, fondo (`.av-bg`, `.av-noise`), `@keyframes` y sus clases de animación (`flicker`, `blink`, `pulse`, `fade-in`, `slide-in`), efectos de texto neón (`.neon-*`, `.pixel`, `.mono`), portadas pixel-art (`.cover-*`) y CRT/arena (`.crt*`, `.game-arena`, `.enemy`, `.player-ship`, `.grid-floor`).
- **No:** Tailwind al máximo. Los gradientes múltiples de las portadas y el CRT serían ilegibles como valores arbitrarios.
- **No:** reusar todas las clases existentes de `globals.css` tal cual. Se eligió migrar a Tailwind.
- **Sí:** componente `Button` con variantes. `.btn` se usa en todas las pantallas y repetir sus utilidades sería frágil.
- **Sí:** `generateStaticParams` + `notFound()` en las rutas de juego. Con `cacheComponents` activo, los 8 ids se prerenderizan y un id desconocido da 404 temático.
- **No:** redirigir a `/` en ids inexistentes. Oculta el error al usuario.
- **Sí:** todos los elementos de la plantilla entran (tilt 3D, menú móvil, créditos, botones sociales inertes, footer).
- **Sí:** el botón con el nombre del usuario cierra sesión directamente, igual que la plantilla.

---

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Diferencias visuales al migrar de CSS a Tailwind | Comparar cada pantalla lado a lado con `references/templates/Arcade Vault.html` abierto en el navegador antes de cerrar cada paso. |
| Hydration mismatch por `toLocaleString` o datos aleatorios | `seededScores` es determinista; la única aleatoriedad (incremento de puntuación) corre dentro de `useEffect` en cliente. Fijar locale `"es-ES"` siempre. |
| `cacheComponents` exige `<Suspense>` en accesos a datos de runtime | Los `params` de juego quedan cubiertos por `generateStaticParams`; los componentes con estado son Client Components sin datos de runtime en servidor. Consultar `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` si el build lo reclama. |
| Usar `useUser` en `Nav` fuerza el layout a cliente | Solo `Nav`, `UserProvider` y las pantallas interactivas son Client Components; `layout.tsx` sigue siendo Server Component. |

---

## Lo que **no** entra en esta spec

- Juegos jugables.
- Autenticación real y OAuth.
- Persistencia de usuario o puntuaciones.
- Rankings con datos reales.
- Sistema de créditos.
- Tests automatizados.

Cada uno, si llega, va en su propia spec.
