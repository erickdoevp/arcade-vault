"use client";

import { useState } from "react";
import { GameCard } from "@/components/game-card";
import { CATS, GAMES, type CategoryFilter } from "@/lib/games";

/** Category/filter chip. Also used by the Hall of Fame game tabs. */
export function chipClasses(active: boolean) {
  return `cursor-pointer border bg-bg-2 px-3.5 py-3 font-pixel text-[9px] tracking-[0.12em] ${
    active ? "border-magenta text-magenta shadow-[0_0_10px_rgba(255,0,110,0.35)]" : "border-line text-ink-dim hover:text-ink"
  }`;
}

export function Library() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryFilter>("TODOS");

  const filtered = GAMES.filter(
    (g) => (cat === "TODOS" || g.cat === cat) && g.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="fade-in">
      <section className="mx-auto max-w-[1320px] px-8 pb-8 pt-16 text-center max-[720px]:px-4 max-[720px]:pb-4 max-[720px]:pt-9">
        <h1 className="flicker m-0 bg-[linear-gradient(180deg,#fff_0%,var(--cyan)_60%,var(--magenta)_110%)] bg-clip-text font-pixel text-[clamp(28px,6vw,64px)] tracking-[0.06em] text-transparent drop-shadow-[0_0_12px_rgba(0,245,255,0.4)]">
          ARCADE VAULT
        </h1>
        <div className="mt-[18px] font-pixel text-[clamp(10px,1.6vw,14px)] tracking-[0.2em] text-yellow">
          INSERTA UNA MONEDA PARA JUGAR <span className="blink">_</span>
        </div>
      </section>

      <div className="mx-auto mt-8 flex max-w-[1320px] flex-wrap gap-3 px-8 max-[720px]:px-4">
        <label className="relative flex h-12 min-w-[220px] flex-1 items-center gap-2.5 border border-line bg-bg-2 px-4 font-mono focus-within:border-cyan focus-within:shadow-[0_0_12px_rgba(0,245,255,0.35)]">
          <span className="font-pixel text-[11px] text-cyan">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar un juego por nombre…"
            className="flex-1 border-0 bg-transparent px-0.5 py-px text-[13px] tracking-[0.04em] text-ink outline-0 placeholder:text-ink-faint"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={chipClasses(cat === c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mb-20 mt-8 grid max-w-[1320px] grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[22px] px-8 max-[720px]:px-4">
        {filtered.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full p-20 text-center text-ink-faint">
            <div className="pixel mb-3 text-[14px] text-magenta">NO HAY RESULTADOS</div>
            <div>Intenta otra búsqueda o categoría.</div>
          </div>
        )}
      </div>
    </div>
  );
}
