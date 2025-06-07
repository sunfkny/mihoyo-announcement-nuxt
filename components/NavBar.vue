<template>
  <div>
    <div
      class="flex justify-center items-center gap-2 p-4"
      :class="{ 'flex-col': vertical }"
    >
      <NuxtLink
        v-if="home"
        to="/"
        class="border-2 border-solid border-transparent hover:border-gray-300 rounded-2xl"
      >
        <div
          class="p-1 transition-all duration-300 flex justify-center items-center"
          :style="{
            width: props.size + 'px',
            height: props.size + 'px',
          }"
        >
          <div
            class="w-full h-full bg-gray-100 rounded-lg flex justify-center items-center"
          >
            <UIcon name="i-lucide-house" class="size-[32px]" />
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        v-for="game in games"
        :key="game.key"
        :to="`/announcement/${game.key}`"
        class="border-2 border-solid border-transparent hover:border-gray-300 rounded-2xl"
      >
        <div
          class="p-1 transition-all duration-300"
          :style="{
            width: props.size + 'px',
            height: props.size + 'px',
          }"
        >
          <img
            :src="game.icon"
            :alt="game.name"
            :title="game.name"
            class="games-icon rounded-lg"
            :style="{ 'view-transition-name': `games-icon-${game.key}` }"
          />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { games } from "~/constants/game";

const props = withDefaults(
  defineProps<{
    size?: number;
    vertical?: boolean;
    home?: boolean;
  }>(),
  {
    size: 128,
    vertical: false,
    home: false,
  }
);
</script>

<style scoped>
.router-link-active {
  border-color: #3778e5;
}
</style>
