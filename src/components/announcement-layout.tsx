import type { ReactNode } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getGame } from "#/utils/games";
import { gameIconProcess } from "#/utils/image-processing";
import { NavBar } from "./nav-bar";

export function AnnouncementLayout({ children }: { children: ReactNode }) {
  const params = useParams({ strict: false });
  const game = getGame("game" in params ? String(params.game) : "");

  return (
    <div className="relative flex flex-col sm:flex-row">
      <div className="sticky top-0 hidden h-dvh flex-col items-center shadow sm:flex">
        <NavBar vertical />
      </div>

      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-white/50 p-4 shadow backdrop-blur dark:bg-gray-800/50 sm:hidden">
        <Link
          to="/"
          aria-label="首页"
          className="flex size-8 items-center justify-center p-0"
          viewTransition
        >
          <ArrowLeft className="size-6" />
        </Link>
        {game && (
          <div className="flex items-center justify-center gap-2">
            <img
              src={gameIconProcess(game.icon)}
              alt={game.name}
              title={game.name}
              width={32}
              height={32}
              className="rounded-icon"
              style={{ viewTransitionName: `games-icon-${game.key}` }}
            />
            {game.name}
          </div>
        )}
        <div className="size-8" />
      </header>

      <main className="mx-auto w-full max-w-[768px] p-4 lg:p-0">
        {children}
      </main>
      <div className="sm:w-[108px]" />
    </div>
  );
}
