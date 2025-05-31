<template>
  <div>
    <div class="games-nav-bar flex justify-center items-center gap-2">
      <NuxtLink
        v-for="game in games"
        :key="game.key"
        class="games-nav-bar-item rounded-md border-2 border-solid border-transparent p-1 transition-all duration-300 hover:border-gray-300"
        :style="{ 'view-transition-name': `games-nav-bar-item-${game.key}` }"
        :to="`/announcement/${game.key}`"
      >
        <img
          class="rounded-xs"
          :src="game.icon"
          :alt="game.name"
          :title="game.name"
          :width="props.size"
          :height="props.size"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { games } from "~/constants/game";

const props = defineProps({
  size: {
    type: Number,
    default: 128,
  },
});
</script>

<style scoped>
.router-link-active {
  border-color: #3778e5;
}
</style>
