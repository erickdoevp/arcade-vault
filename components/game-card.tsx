"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { buttonClasses, type ButtonVariant } from "@/components/button";
import type { Game } from "@/lib/games";

const PLAY_VARIANT: Record<Game["color"], ButtonVariant> = {
  cyan: "cyan",
  green: "cyan",
  magenta: "magenta",
  yellow: "yellow",
};

export function GameCard({ game }: { game: Game }) {
  const tiltRef = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
  };

  const onLeave = () => {
    const el = tiltRef.current;
    if (el) el.style.transform = "";
  };

  return (
    <Link
      ref={tiltRef}
      href={`/games/${game.id}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={[
        "group relative flex cursor-pointer flex-col gap-3.5 border border-line p-3.5",
        "bg-linear-to-b from-bg-2 to-bg-3 [transform-style:preserve-3d] will-change-transform",
        "[transition:transform_180ms_ease,box-shadow_220ms_ease,border-color_220ms_ease]",
        "hover:border-cyan hover:[transform:translateY(-6px)_rotateX(2deg)_rotateY(-2deg)]",
        "hover:shadow-[0_18px_40px_-10px_rgba(0,245,255,0.4),0_0_0_1px_rgba(0,245,255,0.3)]",
        "before:pointer-events-none before:absolute before:-inset-px before:opacity-0 before:content-['']",
        "before:bg-[linear-gradient(135deg,transparent_60%,rgba(0,245,255,0.4))] before:transition-opacity before:duration-[180ms]",
        "hover:before:opacity-50",
      ].join(" ")}
    >
      <div className="relative aspect-[4/3] overflow-hidden border border-line-2">
        <div className={`cover-bg ${game.cover}`} />
        <div className="absolute bottom-2 left-2 z-[2] border border-line bg-black/60 px-1.5 py-1 font-pixel text-[8px] text-cyan">
          {game.cat}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="font-pixel text-[13px] tracking-[0.06em] text-ink">{game.title}</div>
        <div className="min-h-9 text-[12px] text-ink-dim">{game.short}</div>
        <div className="mt-1 flex items-center justify-between gap-2.5">
          <div className="flex flex-col font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
            <span>MEJOR PUNTUACIÓN</span>
            <b className="font-pixel text-[12px] tracking-[0.06em] text-yellow [text-shadow:0_0_6px_rgba(245,255,0,0.6)]">
              {game.best.toLocaleString("es-ES")}
            </b>
          </div>
          <span className={buttonClasses({ variant: PLAY_VARIANT[game.color] })}>JUGAR</span>
        </div>
      </div>
    </Link>
  );
}
