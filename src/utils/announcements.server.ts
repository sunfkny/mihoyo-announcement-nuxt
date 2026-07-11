import type { AnnouncementResponse } from "#/types/announcement";
import type { Game } from "#/utils/games";
import { getBh3Info } from "#/server/services/bh3";
import { getHk4eInfo } from "#/server/services/hk4e";
import { getHkrpgInfo } from "#/server/services/hkrpg";
import { getNapInfo } from "#/server/services/nap";

const CACHE_MAX_AGE = 60_000;
const CACHE_STALE_AGE = CACHE_MAX_AGE + 600_000;

interface CacheEntry {
  value: AnnouncementResponse;
  createdAt: number;
  refreshing?: Promise<AnnouncementResponse>;
}

const cache = new Map<Game, CacheEntry>();

async function loadAnnouncement(game: Game): Promise<AnnouncementResponse> {
  switch (game) {
    case "bh3":
      return getBh3Info();
    case "hk4e":
      return getHk4eInfo();
    case "hkrpg":
      return getHkrpgInfo();
    case "nap":
      return getNapInfo();
  }
}

async function refreshAnnouncement(game: Game, entry?: CacheEntry) {
  const refreshing = loadAnnouncement(game).then((value) => {
    cache.set(game, { value, createdAt: Date.now() });
    return value;
  });

  if (entry) {
    entry.refreshing = refreshing;
  }

  try {
    return await refreshing;
  } finally {
    if (entry) {
      entry.refreshing = undefined;
    }
  }
}

export async function getAnnouncementInfo(game: Game) {
  const entry = cache.get(game);
  if (!entry) {
    return refreshAnnouncement(game);
  }

  const age = Date.now() - entry.createdAt;
  if (age <= CACHE_MAX_AGE) {
    return entry.value;
  }

  if (age <= CACHE_STALE_AGE) {
    if (!entry.refreshing) {
      void refreshAnnouncement(game, entry).catch(() => undefined);
    }
    return entry.value;
  }

  return entry.refreshing ?? refreshAnnouncement(game, entry);
}

export const announcementCacheControl
  = "public, max-age=60, stale-while-revalidate=600";
