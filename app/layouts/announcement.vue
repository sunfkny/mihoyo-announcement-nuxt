<script setup lang="ts">
import { getGame } from "#shared/constants/game";

const route = useRoute();

const game = route.meta.game ? getGame(route.meta.game) : null;
</script>

<template>
  <div class="relative flex flex-col sm:flex-row">
    <div class="h-dvh sticky top-0 hidden sm:flex flex-col items-center shadow">
      <NavBar vertical />
    </div>

    <div
      class="sticky top-0 z-10 flex sm:hidden p-4 justify-between gap-2 items-center bg-white/50 dark:bg-gray-800/50 bg-opacity-30 backdrop-blur shadow"
    >
      <NuxtLink to="/" aria-label="首页" class="size-[32px] p-0 flex justify-center items-center" variant="outline" color="neutral">
        <UIcon name="i-lucide-arrow-left" class="size-[24px]" />
      </NuxtLink>
      <div v-if="game" class="flex gap-2 justify-center items-center">
        <img
          :src="gameIconProcess(game.icon)" :alt="game.name" :title="game.name" :width="32" :height="32" class="rounded-icon" :style="{
            'view-transition-name': `games-icon-${game.key}`,
          }"
        >
        {{ game.name }}
      </div>
      <div class="size-[32px]" />
    </div>

    <main class="w-full max-w-[768px] mx-auto p-4 lg:p-0">
      <slot />
    </main>

    <div class="sm:w-[108px]" />
  </div>
</template>
