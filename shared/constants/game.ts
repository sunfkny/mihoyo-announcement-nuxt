export const gameKeys = [
  "bh3",
  "hk4e",
  "hkrpg",
  "nap",
  // "hna",
] as const;
export type Game = (typeof gameKeys)[number];
export function isGame(game: string): game is Game {
  return gameKeys.includes(game as Game);
}

const gamesMap: Record<Game, { name: string; icon: string }> = {
  bh3: {
    name: "崩坏3",
    icon: "https://fastcdn.mihoyo.com/static-resource-v2/2025/03/14/8a502e85049ca5f539ce3f5e7f03e58e_3747759498074886051.jpg",
  },
  hk4e: {
    name: "原神",
    icon: "https://fastcdn.mihoyo.com/static-resource-v2/2025/03/14/516186272072a512a460c81222aecf1d_2940332403691814685.jpg",
  },
  hkrpg: {
    name: "崩坏：星穹铁道",
    icon: "https://fastcdn.mihoyo.com/static-resource-v2/2025/05/20/847a4d0f0d8d4e60e00f820343c82140_7354616227770343643.png",
  },
  nap: {
    name: "绝区零",
    icon: "https://fastcdn.mihoyo.com/static-resource-v2/2025/07/09/42f5266ac636e9341439731c5e003c15_4896482194300496298.png",
  },
  // hna: {
  //   name: "崩坏：因缘精灵",
  //   icon: "https://fastcdn.mihoyo.com/static-resource-v2/2025/08/28/399940d2d9d9042dfc56413b5637c877_7681873854441484144.png",
  // },
};
export const games = gameKeys.map((key) => {
  const game = gamesMap[key];
  return { key, ...game };
});
export function getGameName(game: Game): string {
  return gamesMap[game].name;
}
export function getGame(game: Game | string) {
  if (isGame(game)) {
    return { ...gamesMap[game], key: game };
  }
  return null;
}
