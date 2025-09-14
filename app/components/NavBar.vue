<script setup lang="ts">
import { games } from "#shared/constants/game";
import { House } from "lucide-vue-next";

withDefaults(
  defineProps<{
    vertical?: boolean;
  }>(),
  {
    vertical: false,
  },
);
</script>

<template>
  <div>
    <div
      class="flex justify-center items-center gap-2 p-4"
      :class="{ 'flex-col': vertical }"
    >
      <NuxtLink
        v-if="vertical"
        prefetch-on="interaction"
        to="/"
        aria-label="首页"
        class="border-2 border-solid border-transparent hover:border-gray-300 rounded-icon"
      >
        <div
          class="p-1 transition-all duration-300 flex justify-center items-center"
        >
          <div
            class="rounded-icon size-[64px] bg-gray-100 dark:bg-gray-700 flex justify-center items-center"
          >
            <House class="size-[40px]" />
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        v-for="game in games"
        :key="game.key"
        prefetch-on="interaction"
        :aria-label="game.name"
        :to="`/announcement/${game.key}`"
        :class="cn('border-2 border-solid border-transparent hover:border-gray-300 rounded-icon')"
      >
        <div class="p-1 transition-all duration-300">
          <img
            :src="ossProcess(game.icon, [
              { action: 'resize', params: { w: 256, h: 256 } },
              { action: 'format', params: 'webp' },
            ])"
            :alt="game.name"
            :title="game.name"
            :width="vertical ? 128 : 64"
            :height="vertical ? 128 : 64"
            :class="cn('games-icon rounded-icon w-[64px] transition-all duration-300', { 'sm:w-[128px]': !vertical })"
            :style="{
              'view-transition-name': `games-icon-${game.key}`,
            }"
          >
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  border-color: #3778e5;
}
</style>
