"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/button";
import { useUser } from "@/components/user-provider";

type Section = "inicio" | "biblioteca" | "salon" | "auth";

function activeSection(pathname: string): Section | null {
  if (pathname === "/") return "inicio";
  if (pathname === "/games" || pathname.startsWith("/games/")) return "biblioteca";
  if (pathname === "/hall-of-fame") return "salon";
  if (pathname === "/login") return "auth";
  return null;
}

const DESKTOP_LINK =
  "relative px-3.5 py-2.5 font-pixel text-[9px] tracking-[0.16em] cursor-pointer transition-colors duration-[120ms]";
const DESKTOP_LINK_IDLE = "text-ink-dim hover:text-ink";
const DESKTOP_LINK_ACTIVE =
  "text-cyan [text-shadow:0_0_8px_rgba(0,245,255,0.65)] after:content-[''] after:absolute after:left-3.5 after:right-3.5 after:bottom-1 after:h-0.5 after:bg-cyan after:shadow-[0_0_8px_var(--cyan),0_0_16px_var(--cyan)]";

const MOBILE_LINK = "px-3 py-3.5 font-pixel text-[11px] border-b border-dashed border-line-2";

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const active = activeSection(pathname);
  const close = () => setOpen(false);

  const desktopLink = (section: Section) =>
    `${DESKTOP_LINK} ${active === section ? DESKTOP_LINK_ACTIVE : DESKTOP_LINK_IDLE}`;
  const mobileLink = (section: Section) =>
    `${MOBILE_LINK} ${active === section ? "text-cyan" : "text-ink-dim"}`;

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center gap-6 px-8 py-3.5 max-[840px]:gap-3 max-[840px]:px-4 max-[840px]:py-3 bg-linear-to-b from-[rgba(10,10,15,0.92)] to-[rgba(10,10,15,0.78)] backdrop-blur-[8px] border-b border-line">
        <Link href="/" onClick={close} className="flex items-center gap-2.5 cursor-pointer">
          <div className="size-7 border border-white/18 [background-blend-mode:screen] bg-[linear-gradient(45deg,var(--magenta)_0_50%,transparent_50%),linear-gradient(-45deg,var(--cyan)_0_50%,transparent_50%)] shadow-[0_0_12px_rgba(0,245,255,0.55),inset_0_0_6px_rgba(255,0,110,0.5)]" />
          <div className="neon-cyan font-pixel text-[12px] tracking-[0.12em]">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>

        <div className="ml-8 flex gap-1 max-[840px]:hidden">
          <Link href="/" className={desktopLink("inicio")}>
            Inicio
          </Link>
          <Link href="/games" className={desktopLink("biblioteca")}>
            Biblioteca
          </Link>
          <Link href="/hall-of-fame" className={desktopLink("salon")}>
            Salón de la Fama
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 font-pixel text-[9px] text-yellow max-[840px]:hidden">
          <span className="size-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff8b0,#f5ff00_60%,#b0b800)] shadow-[0_0_8px_var(--yellow)]" />
          <span>CRÉDITOS · 03</span>
        </div>

        {user ? (
          <Button variant="ghost" className="ml-4 max-[840px]:ml-0" onClick={logout}>
            {user.name} ▾
          </Button>
        ) : (
          <ButtonLink href="/login" className="ml-4 max-[840px]:ml-0">
            Iniciar Sesión
          </ButtonLink>
        )}

        <Button
          variant="ghost"
          className="min-[841px]:hidden"
          onClick={() => setOpen(true)}
          aria-label="Menú"
        >
          ≡
        </Button>
      </nav>

      <div
        className={`fixed inset-0 z-55 bg-black/60 transition-opacity duration-[180ms] ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-60 flex w-[min(320px,86vw)] flex-col gap-2 border-l border-line bg-bg-2 px-5 py-6 transition-transform duration-[220ms] ease-[ease] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pixel neon-cyan mb-4 text-[11px]">MENÚ</div>
        <Link href="/" onClick={close} className={mobileLink("inicio")}>
          Inicio
        </Link>
        <Link href="/games" onClick={close} className={mobileLink("biblioteca")}>
          Biblioteca
        </Link>
        <Link href="/hall-of-fame" onClick={close} className={mobileLink("salon")}>
          Salón de la Fama
        </Link>
        <Link href="/login" onClick={close} className={mobileLink("auth")}>
          {user ? "Cuenta" : "Iniciar Sesión"}
        </Link>
        <div className="flex-1" />
        <div className="pixel text-[9px] tracking-[0.16em] text-ink-faint">CRÉDITOS · 03</div>
      </aside>
    </>
  );
}
