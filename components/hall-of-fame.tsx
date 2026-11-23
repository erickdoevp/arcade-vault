"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/button";
import { chipClasses } from "@/components/library";
import { useUser } from "@/components/user-provider";
import { GAMES, seededScores, type ScoreRow } from "@/lib/games";

const fmt = (n: number) => n.toLocaleString("es-ES");

// ----- podium -----
const SLOT = "relative border bg-bg-2 px-3.5 pb-4 pt-[18px] text-center";
const RANK_NUM = "font-pixel text-[28px] [text-shadow:0_0_12px_currentColor]";
const NAME = "mt-2 font-pixel text-[12px] tracking-[0.06em]";
const SCORE = "mt-2 font-pixel text-[16px] text-cyan [text-shadow:0_0_8px_rgba(0,245,255,0.5)]";
const DATE = "mt-1.5 font-mono text-[11px] tracking-[0.12em] text-ink-faint";

function PodiumSlot({ row, tone }: { row: ScoreRow; tone: "silver" | "bronze" }) {
  const border = tone === "silver" ? "border-silver" : "border-bronze";
  const color = tone === "silver" ? "text-silver" : "text-bronze";
  return (
    <div className={`${SLOT} ${border}`}>
      <div className={`${RANK_NUM} ${color}`}>{String(row.rank).padStart(2, "0")}</div>
      <div className={NAME}>{row.name}</div>
      <div className={SCORE}>{fmt(row.score)}</div>
      <div className={DATE}>{row.date}</div>
    </div>
  );
}

// ----- table -----
const GRID =
  "grid grid-cols-[70px_1fr_1fr_140px] items-center gap-2.5 max-[720px]:grid-cols-[50px_1fr_90px_90px]";
const ROW = `${GRID} border-b border-line-2 font-mono text-[13px] max-[720px]:text-[12px] opacity-0 animate-[rise_360ms_ease-out_forwards]`;
const ROW_PAD = "px-[18px] py-3 max-[720px]:px-3 max-[720px]:py-2.5";

const TOP_RK = [
  "text-gold [text-shadow:0_0_6px_rgba(255,207,58,0.6)]",
  "text-silver",
  "text-bronze",
];
const TOP_SC = [
  "text-gold [text-shadow:0_0_6px_rgba(255,207,58,0.6)]",
  "text-silver [text-shadow:0_0_6px_rgba(0,245,255,0.4)]",
  "text-bronze [text-shadow:0_0_6px_rgba(0,245,255,0.4)]",
];

export function HallOfFame() {
  const { user } = useUser();
  const [tab, setTab] = useState(GAMES[0].id);
  const rows = seededScores(tab.length * 23 + 7, 12);
  const game = GAMES.find((g) => g.id === tab)!;
  const youRank = 8 + (tab.length % 4);
  const youScore = rows[5].score - 2400;

  return (
    <div className="fade-in mx-auto mb-20 mt-8 max-w-[1200px] px-8 max-[720px]:px-4">
      <div className="mb-7 text-center">
        <h1 className="m-0 bg-[linear-gradient(180deg,var(--yellow),var(--magenta))] bg-clip-text font-pixel text-[clamp(24px,4.5vw,44px)] tracking-[0.08em] text-transparent drop-shadow-[0_0_14px_rgba(245,255,0,0.4)]">
          SALÓN DE LA FAMA
        </h1>
        <p className="pixel mx-0 mb-0 mt-3 text-[10px] tracking-[0.1em] text-ink-dim">
          LOS NOMBRES QUE NUNCA SE BORRAN DE LA PANTALLA
        </p>
      </div>

      <div className="mb-[22px] flex flex-wrap justify-center gap-1.5">
        {GAMES.map((g) => (
          <button key={g.id} type="button" className={chipClasses(tab === g.id)} onClick={() => setTab(g.id)}>
            {g.title}
          </button>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-[1fr_1.2fr_1fr] items-end gap-3.5 max-[720px]:grid-cols-1">
        <PodiumSlot row={rows[1]} tone="silver" />
        <div className={`${SLOT} border-gold shadow-[0_0_22px_rgba(255,207,58,0.35)]`}>
          <div className="pixel text-[9px] tracking-[0.18em] text-gold">CAMPEÓN</div>
          <div className={`${RANK_NUM} mt-1 text-[36px] text-gold`}>01</div>
          <div className={NAME}>{rows[0].name}</div>
          <div className={`${SCORE} text-[20px]`}>{fmt(rows[0].score)}</div>
          <div className={DATE}>{rows[0].date}</div>
        </div>
        <PodiumSlot row={rows[2]} tone="bronze" />
      </div>

      <div className="border border-line bg-bg-2">
        <div
          className={`${GRID} ${ROW_PAD} border-b border-line font-pixel text-[10px] tracking-[0.16em] text-ink-faint max-[720px]:text-[12px]`}
        >
          <div>RANGO</div>
          <div>JUGADOR</div>
          <div>PUNTUACIÓN</div>
          <div>FECHA</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={`${tab}-${r.name}`}
            className={`${ROW} ${ROW_PAD}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={`font-pixel text-[11px] ${TOP_RK[i] ?? "text-ink-dim"}`}>
              #{String(r.rank).padStart(2, "0")}
            </div>
            <div className="text-ink">{r.name}</div>
            <div
              className={`font-pixel text-[12px] ${TOP_SC[i] ?? "text-cyan [text-shadow:0_0_6px_rgba(0,245,255,0.4)]"}`}
            >
              {fmt(r.score)}
            </div>
            <div className="text-ink-faint">{r.date}</div>
          </div>
        ))}
        {user && (
          <>
            <div className="grid grid-cols-1 border-b border-line-2 bg-[rgba(245,255,0,0.04)] px-[18px] py-2 font-pixel text-[9px] tracking-[0.16em] text-yellow opacity-0 animate-[rise_360ms_ease-out_forwards]">
              ▸ TU MEJOR MARCA EN {game.title}
            </div>
            <div
              key={`${tab}-you`}
              className={`${ROW} border-l-[3px] border-l-yellow bg-[rgba(245,255,0,0.05)] py-3 pl-[15px] pr-[18px] max-[720px]:py-2.5 max-[720px]:pr-3`}
              style={{ animationDelay: `${rows.length * 50 + 50}ms` }}
            >
              <div className="font-pixel text-[11px] text-yellow">#{String(youRank).padStart(2, "0")}</div>
              <div className="text-yellow">{user.name}</div>
              <div className="font-pixel text-[12px] text-yellow [text-shadow:0_0_6px_rgba(245,255,0,0.5)]">
                {fmt(youScore || 9999)}
              </div>
              <div className="text-ink-faint">11/05/2026</div>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 text-center">
        <ButtonLink href="/" size="lg">
          VOLVER A LA BIBLIOTECA
        </ButtonLink>
      </div>
    </div>
  );
}
