import type { AnnouncementResponse } from "#/types/announcement";
import type { Game } from "#/utils/games";
import { queryOptions } from "@tanstack/react-query";
import { getAnnouncement } from "#/utils/announcements.functions";

async function fetchAnnouncement(game: Game): Promise<AnnouncementResponse> {
  if (typeof window === "undefined") {
    return getAnnouncement({ data: game });
  }

  const response = await fetch(`/api/announcement/${game}`);
  if (!response.ok) {
    throw new Error(`获取失败: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<AnnouncementResponse>;
}

export function announcementQueryOptions(game: Game) {
  return queryOptions({
    queryKey: ["announcement", game],
    queryFn: () => fetchAnnouncement(game),
    staleTime: 60_000,
  });
}
