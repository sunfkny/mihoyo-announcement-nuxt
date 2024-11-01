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
        body: { background: /*tw:*/ `bg-[#050505] rounded-lg text-white` },
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
        v-html="content"
        class="content nap-zh-cn scroll-hack max-h-[calc(100vh-14rem)] min-h-4 overflow-y-auto"
      ></div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string | null;
  content?: string | null;
}>();
const modal = useModal();
</script>

<style scoped>
@font-face {
  font-family: nap-zh-cn;
  font-display: swap;
  font-weight: 400;
  src: url("https://sdk.mihoyo.com/nap/announcement/fonts/zh-cn.7f7b01ec.ttf")
    format("truetype");
}

.nap-zh-cn {
  font-family:
    nap-zh-cn,
    Microsoft YaHei,
    "微软雅黑",
    Arial,
    sans-serif;
}

.scroll-hack {
  width: 100%;
  padding-right: 0.13rem;
}

.scroll-hack::-webkit-scrollbar {
  width: 0.07rem;
}

.scroll-hack::-webkit-scrollbar-thumb {
  background: #232323;
  border-radius: 0.03rem;
}

.scroll-hack::-webkit-scrollbar-track {
  background: #131313;
  border-radius: 0.03rem;
}

.content {
  font-size: 16px;
  line-height: 0.38rem;
  padding: 0 0.15rem 0.16rem;
  color: #ccc;
}

.content ::v-deep(*) {
  margin: 0;
  word-break: break-word;
  color: inherit;
}

.content ::v-deep(ol),
.content ::v-deep(ul) {
  padding-left: 0.13rem;
}

.content ::v-deep(li) {
  width: 100%;
  word-break: break-all;
}

.content ::v-deep(sub),
.content ::v-deep(sup),
.content ::v-deep(u) {
  color: inherit !important;
}

.content ::v-deep(em),
.content ::v-deep(strong) {
  color: #ffc300;
  font-weight: 400;
}

.content ::v-deep(a) {
  display: block;
  width: fit-content;
  height: fit-content;
  min-width: 100%;
  min-height: 0.32rem;
  line-height: 0.32rem;
  border-radius: 0.16rem;
  padding: 0.05rem 0.1rem 0.05rem 0;
  font-size: 0.28rem;
  color: #00b2ff;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
}

.content ::v-deep(hr) {
  background: hsla(0, 0%, 100%, 0.1);
  height: 0.01rem;
}

.content ::v-deep(h1),
.content ::v-deep(h2) {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  width: fit-content;
  padding: 0 0.03rem;
}

.content ::v-deep(h1) {
  font-size: 0.28rem !important;
  color: #fff !important;
  margin-bottom: 0.1rem;
  line-height: 0.32rem;
}

.content ::v-deep(h2) {
  font-size: 0.24rem;
  color: #fff !important;
  align-items: flex-start;
  line-height: 0.28rem;
  margin-bottom: 0.16rem;
}

.content ::v-deep(h2:before) {
  background: #fff;
  margin-top: 0.08rem;
}

.content ::v-deep(h2:after) {
  display: none;
}

.content ::v-deep(code) {
  white-space: pre-wrap;
}

.content ::v-deep(.table-wrapper a) {
  border-radius: 0;
}

.content ::v-deep(iframe),
.content ::v-deep(img),
.content ::v-deep(table),
.content ::v-deep(video) {
  max-width: 100% !important;
  height: unset !important;
  margin: auto;
}

.content ::v-deep(.table-cell),
.content ::v-deep(table tbody:first-of-type tr:first-child td),
.content ::v-deep(table tbody:first-of-type tr:first-child th),
.content ::v-deep(table tbody:first-of-type tr:not(:first-child) td),
.content ::v-deep(table tbody:not(:first-child) td),
.content ::v-deep(table thead tr:first-child td),
.content ::v-deep(table thead tr:first-child th) {
  height: 0.18rem !important;
  box-sizing: border-box;
  border-bottom: 0.06rem solid #232323;
  border-right: 0.06rem solid #232323;
  text-align: center;
}

.content ::v-deep(table) {
  font-size: 0.26rem;
  width: 100% !important;
  word-break: break-all;
  border-radius: 0.1rem;
  border-collapse: separate;
  border-spacing: 0;
  border: 0.06rem solid #232323 !important;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #1a1a1a;
}

.content ::v-deep(table p),
.content ::v-deep(table span) {
  color: inherit;
}

.content ::v-deep(table td) {
  padding: 0.37rem;
}

.content ::v-deep(table tr td:last-child) {
  border-right: none !important;
}

.content ::v-deep(table tr:last-child td) {
  border-bottom: none !important;
}

.content ::v-deep(table tbody:first-of-type tr:first-child td),
.content ::v-deep(table tbody:first-of-type tr:first-child th) {
  background-color: #1a1a1a !important;
  box-sizing: border-box;
}

.content ::v-deep(table tbody:not(:first-child) td) {
  background-color: #000;
}

.content ::v-deep(summary) {
  position: relative;
}
</style>
