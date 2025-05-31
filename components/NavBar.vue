<template>
  <div>
    <div
      class="flex justify-center items-center gap-2 p-4"
      :class="{ 'flex-col': vertical }"
    >
      <NuxtLink v-if="home" to="/">
        <UButton
          variant="outline"
          color="neutral"
          class="p-0"
          :class="{ [roundedClass]: true }"
        >
          <div class="size-[64px] flex justify-center items-center">
            <UIcon name="i-lucide-house" class="size-[32px]" />
          </div>
        </UButton>
      </NuxtLink>
      <NuxtLink
        v-for="game in games"
        :key="game.key"
        class="border-2 border-solid border-transparent p-1 transition-all duration-300 hover:border-gray-300"
        :class="{ [roundedClass]: true }"
        :to="`/announcement/${game.key}`"
      >
        <img
          :src="game.icon"
          :alt="game.name"
          :title="game.name"
          :width="props.size"
          :height="props.size"
          class="games-icon"
          :style="{ 'view-transition-name': `games-icon-${game.key}` }"
        />
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

const roundedClass = computed(() => {
  if (props.size <= 80) {
    return "rounded-xl";
  } else if (80 < props.size && props.size < 112) {
    return "rounded-2xl";
  } else {
    return "rounded-3xl";
  }
});
</script>

<style scoped>
.router-link-active {
  border-color: #3778e5;
}
</style>
