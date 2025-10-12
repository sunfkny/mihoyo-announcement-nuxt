<script setup lang="ts">
defineProps<{
  item: {
    title: string;
    content: string;
    image: string;
  };
}>();

useFontFace(
  "bh3WebFont",
  "https://webstatic.mihoyo.com/bh3/upload/announcement/font/zh-cn.ttf",
  {
    display: "swap",
  },
);

const { open, click } = useClickOpenIgnoreSelection();
</script>

<template>
  <div @click="click">
    <slot />
  </div>
  <UModal
    v-model:open="open"
    :title="item.title"
    class="divide-neutral-800"
    :ui="{
      content: 'bg-[#003366] text-white max-w-screen sm:max-w-[768px]',
      header: 'justify-between',
      title: 'text-white font-bold text-xl',
    }"
  >
    <template #close>
      <UButton
        class="text-white"
        icon="lucide:x"
        variant="ghost"
      />
    </template>
    <template #body>
      <div
        class="content useWebFont scrollHack max-h-[calc(100vh-14rem)] min-h-4 pr-4 overflow-y-scroll"
      >
        <img
          :src="item.image"
          class="w-full mb-4"
        >
        <div v-html="item.content" />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.useWebFont {
  font-family:
    bh3WebFont,
    Microsoft YaHei,
    "微软雅黑",
    Arial,
    sans-serif;
}

.scrollHack::-webkit-scrollbar {
  width: 5px;
}

.scrollHack::-webkit-scrollbar-thumb {
  background: #00c3ff;
  border-radius: 5px;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.scrollHack::-webkit-scrollbar-track {
  padding: 0 5px;
  background-color: rgba(1, 188, 246, 0.2);
  border-radius: 5px;
}

.scrollHack::-webkit-scrollbar-button {
  pointer-events: none;
  width: 5px;
  height: 0;
}

.content ::v-deep(strong) {
  color: #ffe146;
}

.content ::v-deep(em),
.content ::v-deep(h1),
.content ::v-deep(h2),
.content ::v-deep(h3),
.content ::v-deep(h4),
.content ::v-deep(h5),
.content ::v-deep(strong) {
  font-weight: 400 !important;
}

.content ::v-deep(h1) {
  font-size: 1.33rem;
  border-bottom: 0.01rem solid #c5d8e3;
}

.content ::v-deep(h2) {
  display: flex;
  color: #00c3ff;
  align-items: center;
  position: relative;
}

.content ::v-deep(h2:before) {
  display: block;
  content: "";
  width: 0;
  height: 0;
  margin-right: 5px;
  border-left: 4px solid #01bcf6;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
}
</style>
