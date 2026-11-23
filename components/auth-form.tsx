"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { useUser } from "@/components/user-provider";

const FIELD = "mb-3 flex flex-col gap-1.5";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint";
const INPUT =
  "h-11 border border-line bg-bg px-3 font-mono outline-0 [transition:border-color_140ms,box-shadow_140ms] focus:border-cyan focus:shadow-[0_0_12px_rgba(0,245,255,0.35)]";
const TAB = "cursor-pointer border-0 p-3 font-pixel text-[9px] tracking-[0.14em]";
const TAB_ON = "bg-[rgba(0,245,255,0.08)] text-cyan [text-shadow:0_0_6px_rgba(0,245,255,0.5)]";
const TAB_OFF = "bg-transparent text-ink-dim";

export function AuthForm() {
  const router = useRouter();
  const { login, logout } = useUser();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(user);
    router.push("/");
  };

  const playAsGuest = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="fade-in flex items-center justify-center px-5 py-[60px]">
      <div className="relative w-[min(440px,100%)] border border-line bg-bg-2 p-7 shadow-[0_0_30px_rgba(0,245,255,0.18)] before:pointer-events-none before:absolute before:inset-1 before:border before:border-dashed before:border-[rgba(0,245,255,0.18)] before:content-['']">
        <div className="mb-[18px] text-center">
          <div className="mx-auto mb-3 size-14 border border-white/18 [background-blend-mode:screen] bg-[linear-gradient(45deg,var(--magenta)_0_50%,transparent_50%),linear-gradient(-45deg,var(--cyan)_0_50%,transparent_50%)] shadow-[0_0_16px_rgba(0,245,255,0.55),inset_0_0_8px_rgba(255,0,110,0.5)]" />
          <h2 className="neon-cyan mx-0 mb-0 mt-1 font-pixel text-[16px] tracking-[0.1em]">ARCADE VAULT</h2>
          <div className="mono mt-1.5 text-[11px] tracking-[0.16em] text-ink-faint">ACCESO AL SISTEMA · v2.6</div>
        </div>

        <div className="my-[18px] grid grid-cols-2 border border-line">
          <button type="button" className={`${TAB} ${tab === "in" ? TAB_ON : TAB_OFF}`} onClick={() => setTab("in")}>
            INICIAR SESIÓN
          </button>
          <button type="button" className={`${TAB} ${tab === "up" ? TAB_ON : TAB_OFF}`} onClick={() => setTab("up")}>
            CREAR CUENTA
          </button>
        </div>

        <form onSubmit={submit}>
          <div className={FIELD}>
            <label htmlFor="auth-user" className={LABEL}>
              Usuario
            </label>
            <input
              id="auth-user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="px_kai"
              className={INPUT}
            />
          </div>
          {tab === "up" && (
            <div className={`${FIELD} slide-in`}>
              <label htmlFor="auth-email" className={LABEL}>
                Correo electrónico
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jugador@vault.gg"
                className={INPUT}
              />
            </div>
          )}
          <div className={FIELD}>
            <label htmlFor="auth-pass" className={LABEL}>
              Contraseña
            </label>
            <input
              id="auth-pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className={INPUT}
            />
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full">
            {tab === "in" ? "ENTRAR AL VAULT" : "CREAR Y JUGAR"}
          </Button>
        </form>

        <Button variant="ghost" className="mt-2.5 w-full" onClick={playAsGuest}>
          JUGAR COMO INVITADO
        </Button>

        <div className="my-4 flex items-center gap-3 font-pixel text-[8px] tracking-[0.16em] text-ink-faint before:h-px before:flex-1 before:bg-line before:content-[''] after:h-px after:flex-1 after:bg-line after:content-['']">
          O CONTINÚA CON
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="ghost" className="px-3! text-[9px]!">
            ◆  GOOGLE
          </Button>
          <Button variant="ghost" className="px-3! text-[9px]!">
            ▣  GITHUB
          </Button>
        </div>

        <div className="mt-[18px] text-center text-[11px] tracking-[0.1em] text-ink-faint">
          AL ENTRAR ACEPTAS LOS TÉRMINOS DEL SALÓN ARCADE
        </div>
      </div>
    </div>
  );
}
