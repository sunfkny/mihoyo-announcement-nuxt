<template>
  <div class="relative flex flex-col sm:flex-row">
    <div class="h-dvh sticky top-0 hidden sm:flex flex-col items-center shadow">
      <NavBar :size="64" vertical home></NavBar>
    </div>

    <div
      class="sticky top-0 z-10 flex sm:hidden p-4 justify-between gap-2 items-center bg-white/50 dark:bg-gray-800/50 bg-opacity-30 backdrop-blur shadow"
    >
      <NuxtLink
        to="/"
        class="size-[32px] p-0 flex justify-center items-center"
        variant="outline"
        color="neutral"
      >
        <UIcon class="size-[24px]" name="i-lucide-arrow-left" />
      </NuxtLink>
      <div class="flex gap-2 justify-center items-center">
        <img
          :src="game?.icon"
          :alt="game?.name"
          :title="game?.name"
          :width="32"
          :height="32"
          class="games-icon"
          :style="{
            'view-transition-name': `games-icon-${gameKey}`,
          }"
        />
        {{ game?.name }}
      </div>
      <div class="size-[32px]"></div>
    </div>

    <main class="max-w-[768px] mx-auto p-4 lg:p-0">
      <slot></slot>
    </main>

    <div class="sm:w-[108px]"></div>
  </div>
</template>

<script setup lang="ts">
import { getGame } from "~/constants/game";

const route = useRoute();

const gameKey = computed(() => {
  return route.path.replaceAll(/^(\/announcement\/)/g, "");
});
const game = computed(() => getGame(gameKey.value));
</script>
