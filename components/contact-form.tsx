"use client";

import { useActionState, useState, type FormEvent, type ReactNode } from "react";
import { sendContactMessage } from "@/app/about/actions";
import { Button } from "@/components/button";
import { CONTACT_LIMITS, type ContactState } from "@/lib/contact";

type FormValues = { name: string; email: string; message: string };

const EMPTY: FormValues = { name: "", email: "", message: "" };
const INITIAL_STATE: ContactState = { status: "idle" };

const FIELD = "mb-3 flex flex-col gap-1.5";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint";
/** Template inputs/textarea; the textarea keeps the browser default size (13.333px) and the template row height (18px, its "normal" with the template font metrics). */
const CONTROL =
  "border border-line bg-bg font-mono tracking-normal text-ink outline-0 [transition:border-color_140ms,box-shadow_140ms] placeholder:text-ink-faint focus:border-cyan focus:shadow-[0_0_12px_rgba(0,245,255,0.35)]";

/** `.btn.xl.press` of the template: full width with a deeper press on :active. */
const SUBMIT =
  "w-full active:translate-y-[3px]! active:scale-[0.99]! active:shadow-[inset_0_0_6px_rgba(0,245,255,0.2)]! disabled:cursor-wait";

/**
 * Contact form of the About page. Client validation (shake) blocks empty fields;
 * otherwise `sendContactMessage` runs through `useActionState` and its result is
 * shown in the template terminal (green on success, magenta on error).
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactMessage, INITIAL_STATE);
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [shake, setShake] = useState(false);
  // The result the user closed with ENVIAR OTRO / REINTENTAR. Each submission
  // returns a new state object, so the next result shows up again on its own.
  const [dismissed, setDismissed] = useState<ContactState | null>(null);

  const set = (key: keyof FormValues) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      e.preventDefault(); // also cancels the action: no request reaches the server
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const sendAnother = () => {
    setDismissed(state);
    setValues(EMPTY);
  };
  const retry = () => setDismissed(state);

  const result = state.status !== "idle" && state !== dismissed ? state : null;

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      className={`relative border border-line bg-bg-2 p-7 transition-transform duration-[80ms] before:pointer-events-none before:absolute before:inset-1 before:border before:border-dashed before:border-[rgba(0,245,255,0.15)] before:content-[''] ${
        shake ? "motion-safe:animate-[shake_0.4s]" : ""
      }`}
    >
      {result === null ? (
        <>
          <div className={FIELD}>
            <label htmlFor="contact-name" className={LABEL}>
              NOMBRE
            </label>
            <input
              id="contact-name"
              name="name"
              value={values.name}
              onChange={set("name")}
              readOnly={isPending}
              maxLength={CONTACT_LIMITS.name}
              placeholder="px_kai"
              className={`${CONTROL} h-11 px-3`}
            />
          </div>
          <div className={FIELD}>
            <label htmlFor="contact-email" className={LABEL}>
              CORREO ELECTRÓNICO
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={values.email}
              onChange={set("email")}
              readOnly={isPending}
              maxLength={CONTACT_LIMITS.email}
              placeholder="jugador@vault.gg"
              className={`${CONTROL} h-11 px-3`}
            />
          </div>
          <div className={FIELD}>
            <label htmlFor="contact-message" className={LABEL}>
              MENSAJE
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={set("message")}
              readOnly={isPending}
              maxLength={CONTACT_LIMITS.message}
              placeholder="Cuéntanos qué tienes en mente…"
              className={`${CONTROL} min-h-[110px] w-full resize-y p-3 text-[13.333px] leading-[18px]`}
            />
          </div>

          {/* Honeypot: off-screen and skipped by keyboard and screen readers; bots fill it. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-0 size-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <Button type="submit" size="xl" className={SUBMIT} disabled={isPending}>
            {isPending ? (
              <>
                <span className="btn-loader" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                TRANSMITIENDO…
              </>
            ) : (
              "▶  ENVIAR MENSAJE"
            )}
          </Button>
        </>
      ) : result.status === "success" ? (
        <Terminal tone="success">
          <PromptLine />
          <div className="text-ink-dim">[OK] Conectando con servidor…</div>
          <div className="text-ink-dim">[OK] Validando contenido…</div>
          <div className="text-ink-dim">[OK] Transmitiendo paquete…</div>
          <div className="mt-3 whitespace-pre-wrap font-bold text-green [text-shadow:0_0_6px_rgba(0,255,136,0.45)]">
            &gt; MENSAJE RECIBIDO. TE RESPONDEREMOS PRONTO. GRACIAS, {result.name.toUpperCase()}.
            <Caret />
          </div>
          <div className="mt-[18px]">
            <Button variant="ghost" onClick={sendAnother}>
              ENVIAR OTRO MENSAJE
            </Button>
          </div>
        </Terminal>
      ) : (
        <Terminal tone="error">
          <PromptLine />
          <div className="text-ink-dim">[OK] Conectando con servidor…</div>
          <div className="text-magenta">[ERR] {result.detail}</div>
          <div className="mt-3 whitespace-pre-wrap font-bold text-magenta [text-shadow:0_0_6px_rgba(255,0,110,0.45)]">
            &gt; TRANSMISIÓN FALLIDA.
            <Caret />
          </div>
          <div className="mt-[18px]">
            <Button variant="ghost" onClick={retry}>
              REINTENTAR
            </Button>
          </div>
        </Terminal>
      )}
    </form>
  );
}

const TERMINAL_TONE = {
  success: "border-green shadow-[0_0_22px_rgba(0,255,136,0.25)]",
  error: "border-magenta shadow-[0_0_22px_rgba(255,0,110,0.25)]",
};

/** `VAULT-OS // TERMINAL` window of the template; `error` swaps the green frame for magenta. */
function Terminal({ tone, children }: { tone: keyof typeof TERMINAL_TONE; children: ReactNode }) {
  return (
    <div
      role="status"
      className={`overflow-hidden border bg-black font-mono ${TERMINAL_TONE[tone]}`}
    >
      <div className="flex items-center gap-2 border-b border-line bg-[#0a0a0f] px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f56]" />
        <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="size-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 font-pixel text-[9px] tracking-[0.14em] text-ink-faint">VAULT-OS // TERMINAL</span>
      </div>
      <div className="px-[18px] pb-[22px] pt-[18px] text-[13px] leading-[1.8]">{children}</div>
    </div>
  );
}

function PromptLine() {
  return (
    <div className="text-green">
      <span className="mr-2 text-cyan">vault@arcade:~$</span> ./send_message --to=team
    </div>
  );
}

function Caret() {
  return <span className="animate-[blink_1s_steps(1)_infinite]">_</span>;
}
