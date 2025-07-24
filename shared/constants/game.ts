export const gameKeys = ["bh3", "hk4e", "hkrpg", "nap"] as const;
export type Game = (typeof gameKeys)[number];
export function isGame(game: string): game is Game {
  return gameKeys.includes(game as Game);
}
const gamesMap: Record<Game, { name: string; icon: string }> = {
  bh3: {
    name: "崩坏3",
    icon: "https://bbs-static.miyoushe.com/upload/op_manual_upload/fe/game_list/game_icons/1715415439042m-bh3-logo-gz.png",
  },
  hk4e: {
    name: "原神",
    icon: "https://bbs-static.miyoushe.com/upload/op_manual_upload/fe/game_list/game_icons/1715415491378m-ys-logo-gz.png",
  },
  hkrpg: {
    name: "崩坏：星穹铁道",
    icon: "https://fastcdn.mihoyo.com/static-resource-v2/2025/05/20/815082f20e9198f092b6d3fcdd1afb17_2296503047981096792.png",
  },
  nap: {
    name: "绝区零",
    icon: "https://bbs-static.miyoushe.com/upload/op_manual_upload/fe/game_list/game_icons/1715415500410m-zzz-logo-gz.png",
  },
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
    return gamesMap[game];
  }
  return null;
}
