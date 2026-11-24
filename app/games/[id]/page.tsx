import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { Leaderboard } from "@/components/leaderboard";
import { GAMES, getGame, seededScores } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

const TAG = "border border-line px-2.5 py-1.5 font-pixel text-[9px] tracking-[0.12em] text-ink-dim";
const STAT_LABEL = "font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint";
const STAT_VALUE = "mt-1.5 font-pixel text-[16px]";

export default function GameDetailPage({ params }: PageProps<"/games/[id]">) {
  return (
    <Suspense fallback={<GameDetailSkeleton />}>
      <GameDetail params={params} />
    </Suspense>
  );
}

function GameDetailSkeleton() {
  return (
    <div className="mx-auto my-12 grid max-w-[1320px] grid-cols-[1.4fr_1fr] gap-8 px-8 max-[900px]:grid-cols-1 max-[720px]:my-6 max-[720px]:px-4">
      <div className="aspect-[16/10] animate-pulse border border-line bg-bg-2" />
      <div className="min-h-[320px] animate-pulse border border-line bg-bg-2" />
    </div>
  );
}

async function GameDetail({ params }: { params: PageProps<"/games/[id]">["params"] }) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  const scores = seededScores(id.length * 17 + 3, 10);

  return (
    <div className="fade-in mx-auto my-12 grid max-w-[1320px] grid-cols-[1.4fr_1fr] gap-8 px-8 max-[900px]:grid-cols-1 max-[720px]:my-6 max-[720px]:px-4">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden border border-line">
          <div className={`cover-bg ${game.cover}`} />
        </div>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className={TAG}>{game.cat}</span>
            <span className={TAG}>1 JUGADOR</span>
            <span className={TAG}>TECLADO / TÁCTIL</span>
            <span className={TAG}>RETRO 1985</span>
          </div>
          <h2 className="neon-cyan m-0 font-pixel text-[clamp(20px,3vw,32px)] tracking-[0.06em]">{game.title}</h2>
          <p className="m-0 text-[14px] leading-[1.7] text-ink-dim">{game.long}</p>
          <div className="mt-2 grid grid-cols-3 gap-px border border-line bg-line">
            <div className="bg-bg-2 p-3.5">
              <div className={STAT_LABEL}>Partidas</div>
              <div className={`${STAT_VALUE} text-cyan [text-shadow:0_0_6px_rgba(0,245,255,0.5)]`}>{game.plays}</div>
            </div>
            <div className="bg-bg-2 p-3.5">
              <div className={STAT_LABEL}>Mejor global</div>
              <div className={`${STAT_VALUE} text-magenta [text-shadow:0_0_6px_rgba(255,0,110,0.5)]`}>
                {game.best.toLocaleString("es-ES")}
              </div>
            </div>
            <div className="bg-bg-2 p-3.5">
              <div className={STAT_LABEL}>Dificultad</div>
              <div className={`${STAT_VALUE} text-yellow [text-shadow:0_0_6px_rgba(245,255,0,0.5)]`}>★ ★ ★ ☆ ☆</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href={`/games/${game.id}/play`} size="xl" pulse>
              ▶  JUGAR AHORA
            </ButtonLink>
            <ButtonLink href="/games" variant="ghost" size="lg">
              VOLVER AL VAULT
            </ButtonLink>
          </div>
        </div>
      </div>

      <aside>
        <Leaderboard scores={scores} />
      </aside>
    </div>
  );
}
