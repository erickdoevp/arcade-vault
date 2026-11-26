import { ContactForm } from "@/components/contact-form";
import { HighlightIcon } from "@/components/highlight-icon";
import { RevealObserver } from "@/components/reveal-observer";
import { HIGHLIGHTS, type Highlight } from "@/lib/about";

const TIP_LED = "size-2 rounded-full";

const TIPS = [
  { text: "RESPUESTA EN 24-48H", led: "bg-green shadow-[0_0_6px_var(--green)]" },
  { text: "SUGERENCIAS BIENVENIDAS", led: "bg-yellow shadow-[0_0_6px_var(--yellow)]" },
  { text: "SIN SPAM, JAMÁS", led: "bg-magenta shadow-[0_0_6px_var(--magenta)]" },
];

const HIGHLIGHT_COLOR: Record<Highlight["color"], string> = {
  cyan: "text-cyan",
  magenta: "text-magenta",
  green: "text-green",
};

/** "Acerca de" page: hero with mission + highlights, pixel divider and contact section. */
export function About() {
  return (
    <div className="fade-in relative">
      {/* HERO */}
      <section className="mx-auto max-w-[1100px] px-8 pb-10 pt-20 text-center">
        <div className="pixel neon-yellow mb-[18px] text-[11px] tracking-[0.24em]">▸ ACERCA DE</div>
        <h1 className="m-0 bg-[linear-gradient(180deg,#fff,var(--cyan)_80%)] bg-clip-text font-pixel text-[clamp(26px,5vw,52px)] tracking-[0.06em] text-transparent drop-shadow-[0_0_14px_rgba(0,245,255,0.4)]">
          ACERCA DE ARCADE VAULT
        </h1>
        <p className="mx-auto mt-7 max-w-[720px] text-[15px] leading-[1.8] tracking-[0.03em] text-ink-dim">
          ARCADE VAULT nació del amor por los videojuegos clásicos. Nuestra misión es preservar y celebrar
          los arcades que definieron una generación, haciéndolos accesibles para todos, en cualquier lugar
          y sin costo.
        </p>

        <div className="mt-[52px] grid grid-cols-3 gap-[18px] max-[820px]:grid-cols-1">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.icon}
              className={`${HIGHLIGHT_COLOR[h.color]} flex items-center gap-4 border border-line bg-bg-2 px-5 py-[18px] text-left transition-[transform,border-color,box-shadow] duration-[220ms] hover:-translate-y-[3px] hover:border-current hover:shadow-[0_12px_28px_-14px_currentColor]`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <HighlightIcon kind={h.icon} />
              <div className="pixel text-[10px] leading-[1.5] tracking-[0.1em] text-ink [text-shadow:none]">
                {h.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div
        className="reveal mx-auto my-[60px] flex max-w-[1200px] items-center gap-4 px-8"
        aria-hidden="true"
      >
        <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--magenta),transparent)]" />
        <div className="div-pixels flex gap-1">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
        <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--magenta),transparent)]" />
      </div>

      {/* CONTACT */}
      <section className="reveal mx-auto mb-20 max-w-[1200px] px-8">
        <div className="grid grid-cols-[1fr_1.2fr] items-start gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-6">
          <div>
            <div className="pixel neon-cyan mb-3.5 text-[11px] tracking-[0.24em]">▸ CONTACTO</div>
            <h2 className="m-0 font-pixel text-[clamp(22px,3.5vw,36px)] tracking-[0.06em] text-cyan [text-shadow:0_0_12px_rgba(0,245,255,0.4)]">
              CONTÁCTANOS
            </h2>
            <p className="mb-6 mt-[18px] text-[14px] leading-[1.7] text-ink-dim">
              ¿Tienes alguna sugerencia, quieres proponer un juego, o simplemente quieres saludar?
              Escríbenos.
            </p>
            <div className="flex flex-col gap-2.5">
              {TIPS.map((tip) => (
                <div
                  key={tip.text}
                  className="flex items-center gap-2.5 font-pixel text-[9px] tracking-[0.14em] text-ink-dim"
                >
                  <span className={`${TIP_LED} ${tip.led}`} />
                  {tip.text}
                </div>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <RevealObserver />
    </div>
  );
}
