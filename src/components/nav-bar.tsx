import { Link } from "@tanstack/react-router";
import { House } from "lucide-react";
import { cn } from "#/lib/utils";
import { games } from "#/utils/games";
import { gameIconProcess } from "#/utils/image-processing";

export function NavBar({ vertical = false }: { vertical?: boolean }) {
  return (
    <nav className={cn("flex items-center justify-center gap-2 p-4", vertical && "flex-col")}>
      {vertical && (
        <Link
          to="/"
          preload="intent"
          aria-label="首页"
          className="rounded-icon border-2 border-solid border-transparent hover:border-gray-300"
          activeOptions={{ exact: true }}
          activeProps={{ className: "game-link-active" }}
        >
          <div className="flex items-center justify-center p-1 transition-all duration-300">
            <div className="rounded-icon flex size-16 items-center justify-center bg-gray-100 dark:bg-gray-700">
              <House className="size-10" />
            </div>
          </div>
        </Link>
      )}
      {games.map((game, index) => (
        <Link
          key={game.key}
          to="/announcement/$game"
          params={{ game: game.key }}
          preload="intent"
          aria-label={game.name}
          className="rounded-icon border-2 border-solid border-transparent hover:border-gray-300"
          activeOptions={{ exact: true }}
          activeProps={{ className: "game-link-active" }}
          style={{ viewTransitionName: `games-icon-${game.key}` }}
        >
          <div className="p-1 transition-all duration-300">
            <img
              src={gameIconProcess(game.icon)}
              alt={game.name}
              title={game.name}
              width={vertical ? 128 : 64}
              height={vertical ? 128 : 64}
              fetchPriority={!vertical && index === 0 ? "high" : "auto"}
              className={cn("rounded-icon w-16 transition-all duration-300", !vertical && "sm:w-32")}
            />
          </div>
        </Link>
      ))}
    </nav>
  );
}
