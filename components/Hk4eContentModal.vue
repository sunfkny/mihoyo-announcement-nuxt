<template>
  <UModal
    v-model:open="open"
    :title="item.title"
    :ui="{
      body: 'bg-[#F9F6F2] rounded-lg text-white',
      content: 'max-w-[768px]',
      close: 'static',
      header: 'justify-between',
    }"
  >
    <div @click="click()">
      <slot></slot>
    </div>
    <template #body>
      <div
        class="content useCloudFont scrollHack max-h-[calc(100vh-14rem)] min-h-4 pr-2 overflow-y-auto"
        v-html="resolveTimeAndResetFontSize(item.content)"
      ></div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    title: string;
    content: string;
  };
}>();

useFontFace(
  "ysCloudFont",
  "https://webstatic.mihoyo.com/common/clgm-static/ys/fonts/zh-cn.ttf",
  {
    display: "swap",
  }
);

const { open, click } = useClickToggleIgnoreSelection();
</script>

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
  width: 4.8px;
}

.scrollHack::-webkit-scrollbar-thumb {
  background: #fff;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  border-left: 0.8px solid #f1eeea;
  border-right: 0.8px solid #f1eeea;
}

.scrollHack::-webkit-scrollbar-track {
  padding: 0 4.8px;
  background-color: rgba(63, 71, 87, 0.2);
  border: 0.8px solid #f1eeea;
  border-radius: 0.008rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
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
