import { createFileRoute } from "@tanstack/react-router";
import { announcementCacheControl, getAnnouncementInfo } from "#/utils/announcements.server";
import { isGame } from "#/utils/games";

export const Route = createFileRoute("/api/announcement/$game")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!isGame(params.game)) {
          return Response.json({ message: "Not found" }, { status: 404 });
        }

        const data = await getAnnouncementInfo(params.game);
        return Response.json(data, {
          headers: {
            "CDN-Cache-Control": announcementCacheControl,
          },
        });
      },
    },
  },
});
