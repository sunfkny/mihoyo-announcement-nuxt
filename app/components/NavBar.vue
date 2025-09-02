<template>
  <div>
    <div
      class="flex justify-center items-center gap-2 p-4"
      :class="{ 'flex-col': vertical }"
    >
      <NuxtLink
        v-if="vertical"
        to="/"
        class="border-2 border-solid border-transparent hover:border-gray-300 rounded-2xl"
      >
        <div
          class="p-1 transition-all duration-300 flex justify-center items-center"
        >
          <div
            class="size-[64px] bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-center items-center"
          >
            <House class="size-[40px]" />
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        v-for="game in games"
        :key="game.key"
        :to="`/announcement/${game.key}`"
        class="border-2 border-solid border-transparent hover:border-gray-300 rounded-2xl"
      >
        <div class="p-1 transition-all duration-300">
          <img
            :src="game.icon"
            :alt="game.name"
            :title="game.name"
            class="games-icon rounded-lg w-[64px] transition-all duration-300"
            :style="{
              'view-transition-name': `games-icon-${game.key}`,
            }"
            :class="{ 'sm:w-[128px]': !vertical }"
          />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { games } from "#shared/constants/game";
import { House } from "lucide-vue-next";

withDefaults(
  defineProps<{
    vertical?: boolean;
  }>(),
  {
    vertical: false,
  }
);
</script>

<style scoped>
.router-link-active {
  border-color: #3778e5;
}
</style>
