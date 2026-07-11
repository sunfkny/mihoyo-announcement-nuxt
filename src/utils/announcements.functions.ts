import type { Game } from "#/utils/games";
import { createServerFn } from "@tanstack/react-start";
import { getAnnouncementInfo } from "#/utils/announcements.server";
import { isGame } from "#/utils/games";

export const getAnnouncement = createServerFn({ method: "GET" })
  .validator((game: string): Game => {
    if (!isGame(game)) {
      throw new Error(`Unknown game: ${game}`);
    }
    return game;
  })
  .handler(({ data }) => getAnnouncementInfo(data));
