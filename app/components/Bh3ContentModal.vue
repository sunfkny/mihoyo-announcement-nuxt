<template>
  <div @click="click()">
    <slot></slot>
  </div>
  <Dialog v-model:open="open">
    <DialogContent
      class="bg-[#003366] border-none shadow text-white max-w-screen sm:max-w-[768px]"
    >
      <DialogHeader>
        <DialogTitle>{{ item.title }}</DialogTitle>
      </DialogHeader>
      <div>
        <div
          class="content useWebFont scrollHack max-h-[calc(100vh-14rem)] min-h-4 pr-2 overflow-y-scroll"
          v-html="item.content"
        ></div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

defineProps<{
  item: {
    title: string;
    content: string;
  };
}>();

useFontFace(
  "bh3WebFont",
  "https://webstatic.mihoyo.com/bh3/upload/announcement/font/zh-cn.ttf",
  {
    display: "swap",
  }
);

const { open, click } = useClickToggleIgnoreSelection();
</script>

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
  width: 4.8px;
}

.scrollHack::-webkit-scrollbar-thumb {
  background: #00c3ff;
  border-radius: 0.15rem;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.scrollHack::-webkit-scrollbar-track {
  padding: 0 4.8px;
  background-color: rgba(1, 188, 246, 0.2);
  border-radius: 0.15rem;
}

.scrollHack::-webkit-scrollbar-button {
  pointer-events: none;
  width: 4.8px;
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
