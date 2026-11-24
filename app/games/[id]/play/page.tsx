import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GamePlayer } from "@/components/game-player";
import { GAMES, getGame } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export default function GamePlayPage({ params }: PageProps<"/games/[id]/play">) {
  return (
    <Suspense fallback={<div className="mx-auto my-12 aspect-[4/3] max-w-[960px] animate-pulse border border-line bg-bg-2" />}>
      <GamePlay params={params} />
    </Suspense>
  );
}

async function GamePlay({ params }: { params: PageProps<"/games/[id]/play">["params"] }) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  return <GamePlayer game={game} />;
}
