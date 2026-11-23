import { ButtonLink } from "@/components/button";
import { HomeSilhouettes } from "@/components/home-silhouettes";

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
    </div>
  );
}
