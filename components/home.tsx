import { ButtonLink } from "@/components/button";
import { FeatureIcon } from "@/components/feature-icon";
import { HomeSilhouettes } from "@/components/home-silhouettes";
import { MiniCard } from "@/components/mini-card";
import { GAMES, type NeonColor } from "@/lib/games";
import { FEATURES } from "@/lib/home";

const SECTION = "mx-auto my-20 max-w-[1320px] px-8";

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
      <div className={`pixel neon-${color} text-[11px] tracking-[0.22em]`}>{kicker}</div>
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
            <span className="animate-[bounce_1.6s_ease-in-out_infinite] text-cyan motion-reduce:animate-none">▼</span>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className={SECTION}>
        <SectionHead kicker="// 01" color="magenta" title="¿POR QUÉ ARCADE VAULT?" />
        <div className="grid grid-cols-4 gap-[18px] max-[980px]:grid-cols-2 max-[520px]:grid-cols-1">
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
        <div className="grid grid-cols-6 gap-4 max-[1100px]:grid-cols-3 max-[600px]:grid-cols-2">
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
    </div>
  );
}
