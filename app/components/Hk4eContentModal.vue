<script setup lang="ts">
defineProps<{
  item: {
    title: string;
    content: string;
    image: string;
  };
}>();

useFontFace(
  "ysCloudFont",
  "https://webstatic.mihoyo.com/common/clgm-static/ys/fonts/zh-cn.ttf",
  {
    display: "swap",
  },
);

const { open, click } = useClickOpenIgnoreSelection();
</script>

<template>
  <div @click="click()">
    <slot />
  </div>
  <UModal
    v-model:open="open"
    :title="item.title"
    class="dark:divide-neutral-200"
    :ui="{
      content: 'bg-[#F9F6F2] border-none shadow text-gray-800 max-w-screen sm:max-w-3xl',
      header: 'justify-between',
      title: 'text-gray-800 font-bold text-xl',
    }"
  >
    <template #close>
      <UButton
        class="text-black"
        icon="lucide:x"
        variant="ghost"
      />
    </template>
    <template #body>
      <div
        class="content useCloudFont scrollHack max-h-[calc(100vh-14rem)] min-h-4 pr-4 overflow-y-auto"
      >
        <img
          :src="item.image"
          class="w-full mb-4"
        >
        <div v-html="resolveTimeAndResetFontSize(item.content)" />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.useCloudFont {
  font-family:
    ysCloudFont,
    Microsoft YaHei,
    "微软雅黑",
    Arial,
    sans-serif;
}

.scrollHack::-webkit-scrollbar {
  width: 5px;
}

.scrollHack::-webkit-scrollbar-thumb {
  background: #fff;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  border-left: 0.8px solid #f1eeea;
  border-right: 0.8px solid #f1eeea;
}

.scrollHack::-webkit-scrollbar-track {
  padding: 0 5px;
  background-color: rgba(63, 71, 87, 0.2);
  border: 1px solid #f1eeea;
  border-radius: 1px;
}

.content ::v-deep(p) {
  line-height: 2;
}

.content ::v-deep(table) {
  width: 100% !important;
  border-color: hsla(39, 13%, 75%, 0.15) !important;
  text-align: center;
  word-break: break-all;
}

.content ::v-deep(table span) {
  color: inherit;
}

.content ::v-deep(table thead) {
  border: 2px solid #c7bca8;
}

.content ::v-deep(table thead tr:first-child td),
.content ::v-deep(table thead tr:first-child th) {
  height: 48px !important;
  background-color: hsla(37, 25%, 90%, 0.8) !important;
  border: 2px solid #c7bca8 !important;
  color: #cc9255 !important;
  padding: 6.4px;
}

.content ::v-deep(table tbody) {
  border: 2px solid #c7bca8;
}

.content ::v-deep(table tbody:first-of-type tr:first-child td),
.content ::v-deep(table tbody:first-of-type tr:first-child th) {
  height: 48px !important;
  background-color: hsla(37, 25%, 90%, 0.8) !important;
  border: 2px solid #c7bca8 !important;
  color: #cc9255 !important;
  padding: 6.4px;
}

.content ::v-deep(table tbody:first-of-type tr:not(:first-child) td),
.content ::v-deep(table tbody:not(:first-child) td) {
  height: 48px !important;
  background-color: #f1eee8 !important;
  border: 2px solid #c7bca8 !important;
  color: #555;
  padding: 6.4px;
}
</style>
