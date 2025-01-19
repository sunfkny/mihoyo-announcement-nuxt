<template>
  <UModal
    :title="title"
    :ui="{
      width: /*tw:*/ `max-w-[768px] sm:max-w-screen`,
      container: /*tw:*/ `sm:p-4 items-center`,
    }"
  >
    <UCard
      :ui="{
        ring: '',
        body: {
          background: /*tw:*/ `bg-[#003366] rounded-lg text-white`,
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6">
            {{ title }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="modal.close()"
          />
        </div>
      </template>
      <div
        class="content useWebFont scrollHack max-h-[calc(100vh-14rem)] min-h-4 pr-2 overflow-y-scroll"
        v-html="content"
      ></div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  title?: string | null;
  content?: string | null;
}>();
const modal = useModal();
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

@font-face {
  font-family: bh3WebFont;
  font-display: swap;
  src: url("https://webstatic.mihoyo.com/bh3/upload/announcement/font/zh-cn.ttf");
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
