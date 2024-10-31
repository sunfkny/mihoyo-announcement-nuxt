<template>
  <div class="w-full animate-pulse">
    <div class="my-4">
      <div class="h-2 bg-gray-200 rounded w-full"></div>
      <div class="h-4 my-1 bg-gray-200 rounded max-w-full w-[500px]"></div>
    </div>
    <div v-for="i in arr" :key="i">
      <div class="h-[280px] my-1 bg-gray-200 rounded w-full"></div>
      <div class="h-4 my-1 bg-gray-200 rounded max-w-full w-[400px]"></div>
      <div class="h-4 my-1 bg-gray-200 rounded max-w-full w-[260px]"></div>
      <div class="h-4 my-1 bg-gray-200 rounded max-w-full w-[360px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const arr = Array.from({ length: 3 }).map((_, i) => i);
</script>
