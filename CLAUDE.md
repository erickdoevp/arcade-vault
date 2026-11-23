# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault is an online platform for playing games and competing for the highest score. It is at the scaffold stage (fresh `create-next-app`): `app/page.tsx` and `app/layout.tsx` still hold template content and metadata.

Work follows **Spec Driven Design** via the `/spec` and `/spec-impl` skills from https://github.com/Klerith/fernando-skills (install with `npx skills@latest add Klerith/fernando-skills`). For new features, write or update a spec first, then implement against it.

## Commands

- `npm run dev` — dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (also the main type-check, since `tsconfig` uses `noEmit`)
- `npm run start` — serve the production build
- `npm run lint` — ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript)

No test framework is configured yet.

## Stack and non-default configuration

- **Next.js 16.4 / React 19.3, App Router only** (`app/`). Per AGENTS.md, APIs differ from older Next.js — check `node_modules/next/dist/docs/` (`01-app/`, `03-architecture/`) before writing framework code.
- `next.config.ts` enables `cacheComponents` and `partialPrefetching` (plus `experimental.agentFeedback`). With Cache Components, data fetching/caching is opt-in via `"use cache"` and dynamic content must sit inside `<Suspense>` — read the docs on this before adding data-fetching routes.
- **Tailwind CSS v4** is wired through a Turbopack loader rule (`@tailwindcss/turbopack` on `*.css` in `next.config.ts`), not PostCSS — there is no `postcss.config` or `tailwind.config`. Theme tokens live in `app/globals.css` under `@theme inline`, with light/dark via CSS variables.
- Route props use the global generated types (e.g. `LayoutProps<"/">`, `PageProps<...>`) rather than hand-written prop interfaces.
- Import alias: `@/*` maps to the repo root.
