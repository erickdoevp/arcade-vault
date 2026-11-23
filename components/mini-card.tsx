import Link from "next/link";
import type { Game } from "@/lib/games";

/** Compact game card for the landing mini-rail. */
export function MiniCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="block cursor-pointer border border-line bg-bg-2 [transition:transform_180ms_ease,border-color_180ms] hover:border-cyan hover:[transform:translateY(-4px)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className={`cover-bg ${game.cover}`} />
      </div>
      <div className="px-3 py-2.5">
        <div className="font-pixel text-[10px] tracking-[0.06em]">{game.title}</div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.14em] text-ink-faint">{game.cat}</div>
      </div>
    </Link>
  );
}
