import type { Game } from "#shared/constants/game";

declare module "nuxt/app" {
  interface PageMeta {
    game?: Game;
  }
}
