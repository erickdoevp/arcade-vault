import { ButtonLink } from "@/components/button";
import { FeatureIcon } from "@/components/feature-icon";
import { HomeSilhouettes } from "@/components/home-silhouettes";
import { MiniCard } from "@/components/mini-card";
import { RevealObserver } from "@/components/reveal-observer";
import { GAMES, type NeonColor } from "@/lib/games";
import Link from "next/link";
import { FAQ, FEATURES, HOME_STATS, PRICING_ITEMS, TICKER, TOP_TODAY } from "@/lib/home";

const SECTION = "reveal mx-auto my-20 max-w-[1320px] px-8";

/** Neon text per color. `neon-green` doesn't exist in globals.css, so green is spelled out. */
const NEON_TEXT: Record<NeonColor, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  yellow: "neon-yellow",
  green: "text-green [text-shadow:0_0_6px_rgba(0,255,136,0.6),0_0_16px_rgba(0,255,136,0.35)]",
};

/** Top-3 medal colors for the "TOP JUGADORES" rows; index 3+ uses the last entry. */
const TOP_STYLE = [
  {
    rank: "text-gold [text-shadow:0_0_6px_rgba(255,207,58,0.6)]",
    score: "text-gold [text-shadow:0_0_6px_rgba(255,207,58,0.6)]",
    glow: "before:bg-[linear-gradient(90deg,rgba(255,207,58,0.14),transparent)]",
  },
  {
    rank: "text-silver",
    score: "text-silver [text-shadow:0_0_6px_rgba(0,245,255,0.4)]",
    glow: "before:bg-[linear-gradient(90deg,rgba(199,208,224,0.10),transparent)]",
  },
  {
    rank: "text-bronze",
    score: "text-bronze [text-shadow:0_0_6px_rgba(0,245,255,0.4)]",
    glow: "before:bg-[linear-gradient(90deg,rgba(217,122,58,0.10),transparent)]",
  },
  {
    rank: "text-ink-faint",
    score: "text-cyan [text-shadow:0_0_6px_rgba(0,245,255,0.4)]",
    glow: "before:bg-[linear-gradient(90deg,rgba(0,245,255,0.06),transparent)]",
  },
];

/** Left accent of each FAQ item, in order. */
const FAQ_ACCENT = ["border-l-cyan", "border-l-magenta", "border-l-yellow"];

const AC_HEAD = "flex min-w-0 items-center justify-between gap-2.5 border-b border-line px-3.5 py-3";
const AC_TITLE =
  "pixel min-w-0 flex-auto truncate text-[10px] tracking-[0.1em] text-cyan [text-shadow:0_0_8px_rgba(0,245,255,0.5)]";

const FEATURE_COLOR: Record<NeonColor, string> = {
  cyan: "text-cyan",
  magenta: "text-magenta",
  yellow: "text-yellow",
  green: "text-green",
};

/** Section header: neon kicker (`// 01`), pixel title and a fading rule. */
function SectionHead({ kicker, color, title }: { kicker: string; color: NeonColor; title: string }) {
  return (
    <div className="mb-9 flex items-center gap-[18px]">
      <div className={`pixel ${NEON_TEXT[color]} text-[11px] tracking-[0.22em]`}>{kicker}</div>
      <h2 className="m-0 font-pixel text-[clamp(18px,2.8vw,28px)] tracking-[0.06em] text-ink">{title}</h2>
      <div className="h-px flex-1 bg-[linear-gradient(90deg,var(--line),transparent)]" />
    </div>
  );
}

/** Landing page (`/`). Static Server Component; ported from references/templates/home-about/home.jsx. */
export function Home() {
  return (
    <div className="fade-in relative">
      {/* HERO */}
      <section className="relative flex min-h-[calc(100vh-60px)] items-center justify-center overflow-hidden px-8 pb-[60px] pt-20">
        <HomeSilhouettes />
        <div className="relative z-[3] max-w-[1100px] text-center">
          <div className="pixel neon-yellow mb-6 text-[11px] tracking-[0.24em]">
            ▸ INSERTA UNA MONEDA<span className="blink">_</span>
          </div>
          <h1 className="m-0 flex flex-col gap-2 font-pixel text-[clamp(32px,7vw,88px)] leading-[1.05] tracking-[0.04em]">
            <span className="text-white [text-shadow:0_0_14px_rgba(255,255,255,0.4)]">EL ARCADE</span>
            <span className="line-2">CLÁSICO ESTÁ</span>
            <span className="line-3">DE VUELTA</span>
          </h1>
          <p className="mx-auto mb-9 mt-7 max-w-[640px] text-[15px] leading-[1.7] tracking-[0.04em] text-ink-dim">
            Juega los mejores clásicos directamente en tu navegador.
            <br />
            Sin descargas. Sin costo. Solo diversión.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/games" size="xl" pulse>
              ▶  EXPLORAR JUEGOS
            </ButtonLink>
            <ButtonLink href="/login" size="xl" variant="magenta">
              ✦  CREAR CUENTA
            </ButtonLink>
          </div>
          <div
            className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-pixel text-[9px] tracking-[0.2em] text-ink-faint"
            aria-hidden="true"
          >
            <span>DESLIZA</span>
            <span className="animate-[av-bounce_1.6s_ease-in-out_infinite] text-cyan motion-reduce:animate-none">▼</span>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className={SECTION}>
        <SectionHead kicker="// 01" color="magenta" title="¿POR QUÉ ARCADE VAULT?" />
        <div className="grid grid-cols-[repeat(4,1fr)] gap-[18px] max-[980px]:grid-cols-[repeat(2,1fr)] max-[520px]:grid-cols-[1fr]">
          {FEATURES.map((f, i) => (
            <div
              key={f.icon}
              className={`${FEATURE_COLOR[f.color]} relative flex flex-col gap-3.5 border border-line bg-linear-to-b from-bg-2 to-bg-3 px-5 py-6 [transition:transform_220ms_ease,box-shadow_220ms_ease,border-color_220ms_ease] hover:border-current hover:shadow-[0_18px_40px_-16px_currentColor,0_0_0_1px_currentColor] hover:[transform:translateY(-6px)]`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <FeatureIcon kind={f.icon} />
              <div className="pixel text-[12px] tracking-[0.1em] [text-shadow:0_0_8px_currentColor]">{f.title}</div>
              <div className="text-[13px] leading-[1.6] text-ink-dim">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GAMES PREVIEW */}
      <section className={SECTION}>
        <SectionHead kicker="// 02" color="cyan" title="JUEGOS DISPONIBLES AHORA" />
        <div className="grid grid-cols-6 gap-4 max-[1100px]:grid-cols-[repeat(3,1fr)] max-[600px]:grid-cols-[repeat(2,1fr)]">
          {GAMES.slice(0, 6).map((g) => (
            <MiniCard key={g.id} game={g} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <ButtonLink href="/games" size="lg">
            VER TODOS LOS JUEGOS →
          </ButtonLink>
        </div>
      </section>

      {/* STATS */}
      <section className="reveal relative overflow-hidden border-y border-line bg-[linear-gradient(180deg,#06060a,#0c0c14)] px-8 py-[60px] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(80%_60%_at_50%_50%,rgba(245,255,0,0.06),transparent_70%)] before:content-['']">
        <div className="relative mx-auto grid max-w-[1200px] grid-cols-[repeat(3,1fr)] gap-8 max-[720px]:grid-cols-[1fr]">
          {HOME_STATS.map((st, i) => (
            <div
              key={st.n}
              className="border-l border-line p-5 text-center first:border-l-0 max-[720px]:border-l-0 max-[720px]:border-t max-[720px]:first:border-t-0"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="neon-yellow font-pixel text-[clamp(32px,5vw,56px)] tracking-[0.04em]">{st.n}</div>
              <div className="pixel mt-2.5 text-[13px] tracking-[0.18em] text-ink">{st.u}</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">{st.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY / LEADERBOARD */}
      <section className={SECTION}>
        <SectionHead kicker="// 03" color="yellow" title="ACTIVIDAD EN VIVO" />
        <div className="grid grid-cols-[1.2fr_1fr] gap-[18px] max-[900px]:grid-cols-1">
          <div className="border border-line bg-bg-2">
            <div className={AC_HEAD}>
              <div className={AC_TITLE}>▸ ÚLTIMAS PUNTUACIONES</div>
            </div>
            <div className="max-h-[360px] overflow-hidden py-1.5">
              {TICKER.map((r, i) => (
                <div
                  key={r.player + r.game}
                  className="grid animate-[tickin_360ms_ease-out_forwards] grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-line-2 px-[18px] py-[11px] font-mono text-[13px] opacity-0 max-[520px]:grid-cols-[1fr_auto] max-[520px]:gap-y-1"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className={`${NEON_TEXT[r.color]} font-pixel text-[10px] tracking-[0.06em]`}>{r.player}</span>
                  <span className="text-[12px] text-ink-dim max-[520px]:col-span-full">▸ {r.game}</span>
                  <span className="font-pixel text-[11px] text-yellow [text-shadow:0_0_6px_rgba(245,255,0,0.5)]">
                    +{r.score.toLocaleString("es-ES")}
                  </span>
                  <span className="text-[11px] tracking-[0.08em] text-ink-faint max-[520px]:col-span-full">{r.ago}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-line bg-bg-2">
            <div className={AC_HEAD}>
              <div className={AC_TITLE}>▸ TOP JUGADORES · HOY</div>
              <Link
                href="/hall-of-fame"
                className="cursor-pointer border border-line bg-transparent px-2.5 py-1.5 font-pixel text-[9px] tracking-[0.14em] text-ink-dim hover:border-magenta hover:text-magenta hover:shadow-[0_0_8px_rgba(255,0,110,0.35)]"
              >
                VER SALÓN →
              </Link>
            </div>
            <div className="flex flex-col gap-2.5 px-[18px] pb-[18px] pt-2.5">
              {TOP_TODAY.map((r, i) => {
                const st = TOP_STYLE[Math.min(i, 3)];
                return (
                  <div
                    key={r.rank}
                    className={`relative grid grid-cols-[36px_1fr_auto_auto] items-center gap-2.5 py-2 font-mono before:pointer-events-none before:absolute before:inset-y-0 before:left-9 before:right-0 before:z-0 before:content-[''] ${st.glow}`}
                  >
                    <span className={`relative z-[1] font-pixel text-[10px] ${st.rank}`}>
                      #{String(r.rank).padStart(2, "0")}
                    </span>
                    <span className="absolute">
                      <span style={{ width: `${100 - i * 16}%` }} />
                    </span>
                    <span className="relative z-[1] font-pixel text-[11px] tracking-[0.06em] text-ink">{r.player}</span>
                    <span className={`relative z-[1] font-pixel text-[11px] ${st.score}`}>
                      {r.score.toLocaleString("es-ES")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={SECTION}>
        <SectionHead kicker="// 04" color="green" title="PRECIOS" />
        <div className="grid grid-cols-[1fr_1fr] items-stretch gap-6 max-[900px]:grid-cols-[1fr]">
          <div className="relative flex flex-col gap-3.5 border border-green bg-[linear-gradient(180deg,var(--bg-2),#0a0e16)] px-7 py-8 shadow-[0_0_28px_rgba(0,255,136,0.18),inset_0_0_14px_rgba(0,255,136,0.08)] before:pointer-events-none before:absolute before:inset-1 before:border before:border-dashed before:border-[rgba(0,255,136,0.3)] before:content-['']">
            <div className="pixel text-[9px] tracking-[0.22em] text-ink-dim">PLAN ÚNICO</div>
            <div className="pixel text-[16px] tracking-[0.08em] text-green [text-shadow:0_0_10px_rgba(0,255,136,0.5)]">
              JUGADOR VAULT
            </div>
            <div className="mt-1.5 flex items-baseline gap-2.5">
              <span className="bg-[linear-gradient(180deg,#fff,var(--green))] bg-clip-text font-pixel text-[64px] tracking-[0.02em] text-transparent drop-shadow-[0_0_12px_rgba(0,255,136,0.5)]">
                $0
              </span>
              <span className="font-pixel text-[11px] tracking-[0.16em] text-ink-dim">/ SIEMPRE</span>
            </div>
            <div className="font-pixel text-[9px] tracking-[0.18em] text-yellow [text-shadow:0_0_6px_rgba(245,255,0,0.45)]">
              SIN TRUCOS · SIN LETRA PEQUEÑA
            </div>
            <ul className="mb-1 mt-2.5 flex list-none flex-col gap-2 p-0">
              {PRICING_ITEMS.map((item) => (
                <li key={item} className="font-mono text-[13px] tracking-[0.02em] text-ink first-letter:text-green">
                  ✔ {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/login" size="xl" pulse className="w-full">
              EMPEZAR GRATIS →
            </ButtonLink>
            <div className="mt-1 text-center font-mono text-[11px] tracking-[0.1em] text-ink-faint">
              No pedimos tarjeta. Nunca lo haremos.
            </div>
            <div className="pixel absolute -right-[18px] -top-[18px] z-[3] rotate-[14deg] border-2 border-magenta bg-[rgba(10,10,15,0.85)] px-[18px] py-2.5 text-center text-[13px] leading-[1.15] tracking-[0.16em] text-magenta shadow-[0_0_14px_rgba(255,0,110,0.35),inset_0_0_8px_rgba(255,0,110,0.2)] [text-shadow:0_0_8px_rgba(255,0,110,0.6)]">
              FREE
              <br />
              PLAY
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3.5">
            {FAQ.map((f, i) => (
              <div key={f.q} className={`border border-l-[3px] border-line bg-bg-2 px-5 py-[18px] ${FAQ_ACCENT[i]}`}>
                <div className="pixel mb-2 text-[10px] tracking-[0.12em] text-ink">{f.q}</div>
                <div className="font-mono text-[13px] leading-[1.6] text-ink-dim">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="reveal relative mx-auto max-w-[900px] px-8 pb-[120px] pt-[100px] text-center before:absolute before:left-1/2 before:top-[30px] before:h-px before:w-[60%] before:-translate-x-1/2 before:bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)] before:opacity-50 before:content-[''] after:absolute after:bottom-[30px] after:left-1/2 after:h-px after:w-[60%] after:-translate-x-1/2 after:bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)] after:opacity-50 after:content-['']">
        <h2 className="pixel mb-9 mt-0 bg-[linear-gradient(180deg,#fff,var(--yellow))] bg-clip-text text-[clamp(22px,4vw,40px)] tracking-[0.08em] text-transparent drop-shadow-[0_0_12px_rgba(245,255,0,0.4)]">
          ¿LISTO PARA JUGAR?
        </h2>
        <ButtonLink href="/games" size="xl" pulse>
          INSERTAR MONEDA →
        </ButtonLink>
        <div className="mt-7 text-[13px] tracking-[0.06em] text-ink-dim">
          Gratis. Sin registro obligatorio. Empieza en segundos.
        </div>
      </section>

      <RevealObserver />
    </div>
  );
}
