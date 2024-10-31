<template>
  <div>
    <div
      class="games-nav-bar flex justify-center items-center"
      :style="{ gap: `8px` }"
    >
      <NuxtLink
        v-for="game in games"
        :key="game.key"
        :to="`/announcement/${game.key}`"
      >
        <img
          :src="game.icon"
          :alt="game.name"
          :title="game.name"
          :width="props.size"
          :height="props.size"
          :style="{ 'view-transition-name': `games-nav-bar-item-${game.key}` }"
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
