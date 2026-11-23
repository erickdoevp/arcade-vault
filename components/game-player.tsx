"use client";

import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/button";
import { useUser } from "@/components/user-provider";
import type { Game } from "@/lib/games";

type Run = { score: number; level: number };
const INITIAL_RUN: Run = { score: 0, level: 1 };

const HUD_LABEL = "font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint";
const HUD_VALUE = "font-pixel text-[16px]";

export function GamePlayer({ game }: { game: Game }) {
  const { user } = useUser();
  const [run, setRun] = useState<Run>(INITIAL_RUN);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [name, setName] = useState(user ? user.name : "INVITADO");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (over || paused) return;
    const t = setInterval(() => {
      const gain = Math.floor(10 + Math.random() * 90);
      setRun(({ score, level }) => {
        const next = score + gain;
        // same rule as the template: level up each time the score crosses a 2500 boundary
        return { score: next, level: next % 2500 < 100 ? level + 1 : level };
      });
    }, 220);
    return () => clearInterval(t);
  }, [over, paused]);

  const restart = () => {
    setRun(INITIAL_RUN);
    setLives(3);
    setPaused(false);
    setOver(false);
    setSaved(false);
  };

  return (
    <div className="fade-in mx-auto my-8 max-w-[1100px] px-6 pb-16 max-[720px]:px-4 max-[720px]:pb-8">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-4 border border-line bg-bg-2 px-[18px] py-3.5">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <div className={HUD_LABEL}>Jugador</div>
            <div className={`${HUD_VALUE} text-ink`}>{name}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className={HUD_LABEL}>Puntuación</div>
            <div className={`${HUD_VALUE} text-cyan [text-shadow:0_0_6px_rgba(0,245,255,0.5)]`}>
              {run.score.toLocaleString("es-ES")}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className={HUD_LABEL}>Vidas</div>
            <div className={`${HUD_VALUE} text-magenta [text-shadow:0_0_6px_rgba(255,0,110,0.5)]`}>
              {"♥ ".repeat(lives).trim() || "—"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className={HUD_LABEL}>Nivel</div>
            <div className={`${HUD_VALUE} text-yellow [text-shadow:0_0_6px_rgba(245,255,0,0.5)]`}>
              {String(run.level).padStart(2, "0")}
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button variant="yellow" onClick={() => setPaused((p) => !p)}>
            {paused ? "REANUDAR" : "PAUSA"}
          </Button>
          <Button variant="magenta" onClick={() => setOver(true)}>
            FIN
          </Button>
          <ButtonLink href={`/games/${game.id}`} variant="ghost">
            SALIR
          </ButtonLink>
        </div>
      </div>

      <div className="crt">
        <div className="crt-screen">
          <div className="game-arena">
            <div className="grid-floor" />
            <div className="enemy e1" />
            <div className="enemy e2" />
            <div className="enemy e3" />
            <div className="player-ship" />
          </div>
          {paused && (
            <div className="crt-content z-[5] bg-black/60">
              <div>
                <div className="pixel neon-yellow text-[22px]">EN PAUSA</div>
                <div className="mono mt-2.5 text-[11px] tracking-[0.16em] text-ink-dim">
                  PULSA REANUDAR PARA CONTINUAR
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="crt-bottom">
          <span className="led">SEÑAL OK</span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>CARGA · 1MB</span>
        </div>
      </div>

      {over && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/70 p-5">
          <div className="relative w-[min(480px,96vw)] border border-magenta bg-bg-2 p-8 text-center shadow-[0_0_30px_rgba(255,0,110,0.4),inset_0_0_16px_rgba(255,0,110,0.18)] before:pointer-events-none before:absolute before:inset-1 before:border before:border-dashed before:border-[rgba(255,0,110,0.4)] before:content-['']">
            <h2 className="m-0 mb-[18px] font-pixel text-[22px] tracking-[0.12em] text-magenta [text-shadow:0_0_12px_rgba(255,0,110,0.7)]">
              FIN DEL JUEGO
            </h2>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">PUNTUACIÓN FINAL</div>
            <div className="mb-1.5 mt-4 font-pixel text-[36px] text-yellow [text-shadow:0_0_16px_rgba(245,255,0,0.6)]">
              {run.score.toLocaleString("es-ES")}
            </div>
            {!saved ? (
              <div className="mb-3 mt-[22px] flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 10))}
                  placeholder="TUS INICIALES"
                  className="h-11 min-w-0 flex-1 border border-line bg-bg px-3 font-mono outline-0 focus:border-cyan focus:shadow-[0_0_10px_rgba(0,245,255,0.35)]"
                />
                <Button variant="yellow" onClick={() => setSaved(true)}>
                  GUARDAR PUNTUACIÓN
                </Button>
              </div>
            ) : (
              <div className="mt-3.5 inline-block w-0 overflow-hidden whitespace-nowrap border-r-2 border-green font-pixel text-[11px] text-green [text-shadow:0_0_8px_var(--green)] animate-[typewriter_1.6s_steps(22)_forwards,caret_0.8s_steps(1)_infinite]">
                ▸ PUNTUACIÓN GUARDADA_
              </div>
            )}
            <div className="mt-[18px] flex flex-wrap justify-center gap-2.5">
              <Button onClick={restart}>JUGAR DE NUEVO</Button>
              <ButtonLink href="/games" variant="magenta">
                VOLVER AL VAULT
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
