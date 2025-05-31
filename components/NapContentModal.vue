<template>
  <UModal
    :title="item.title"
    :ui="{
      body: 'bg-[#050505] rounded-lg text-white',
      content: 'max-w-[768px]',
      close: 'static',
      header: 'justify-between',
    }"
  >
    <slot></slot>
    <template #body>
      <div
        class="content nap-zh-cn-light scroll-hack max-h-[calc(100vh-14rem)] min-h-4 overflow-y-auto"
        v-html="resetFontSize(item.content)"
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
  "nap-zh-cn-light",
  "https://sdk.mihoyo.com/nap/announcement/fonts/zh-cn-light.e490414b.ttf",
  {
    display: "swap",
    weight: "400",
  }
);
</script>

<style scoped>
.nap-zh-cn-light {
  font-family:
    nap-zh-cn-light,
    Microsoft YaHei,
    "微软雅黑",
    Arial,
    sans-serif;
}

.scroll-hack {
  width: 100%;
  padding-right: 6.5px;
}

.scroll-hack::-webkit-scrollbar {
  width: 3.5px;
}

.scroll-hack::-webkit-scrollbar-thumb {
  background: #232323;
  border-radius: 1.5px;
}

.scroll-hack::-webkit-scrollbar-track {
  background: #131313;
  border-radius: 1.5px;
}

.content::v-deep() {
  font-size: 14px;
  line-height: 19px;
  padding: 0 7.5px 8px;
  color: #ccc;
}

.content::v-deep(*) {
  margin: 0;
  word-break: break-word;
  color: inherit;
}

.content::v-deep(ol),
.content::v-deep(ul) {
  padding-left: 6.5px;
}

.content::v-deep(li) {
  width: 100%;
  word-break: break-all;
}

.content::v-deep(sub),
.content::v-deep(sup),
.content::v-deep(u) {
  color: inherit !important;
}

.content::v-deep(em),
.content::v-deep(strong) {
  color: #ffc300;
  font-weight: 400;
}

.content::v-deep(a) {
  display: block;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  min-width: 100%;
  min-height: 16px;
  line-height: 16px;
  border-radius: 8px;
  padding: 2.5px 5px 2.5px 0;
  font-size: 14px;
  color: #00b2ff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
}

.content::v-deep(a[href=""]) {
  pointer-events: none;
}

.content::v-deep(hr) {
  background: hsla(0, 0%, 100%, 0.1);
  height: 0.5px;
}

.content::v-deep(h1),
.content::v-deep(h2) {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-weight: 400;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  padding: 0 1.5px;
}

.content::v-deep(h1) {
  font-size: 14px !important;
  color: #fff !important;
  margin-bottom: 5px;
  line-height: 16px;
}

.content::v-deep(h2) {
  font-size: 12px;
  color: #fff !important;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  line-height: 14px;
  margin-bottom: 8px;
}

.content::v-deep(h2:before) {
  background: #fff;
  margin-top: 4px;
}

.content::v-deep(h2:after) {
  display: none;
}

.content::v-deep(code) {
  white-space: pre-wrap;
}

.content::v-deep(.table-wrapper a) {
  border-radius: 0;
}

.content::v-deep(iframe),
.content::v-deep(img),
.content::v-deep(table),
.content::v-deep(video) {
  max-width: 100% !important;
  height: unset !important;
  margin: auto;
}

.content::v-deep(.table-cell),
.content::v-deep(table tbody:first-of-type tr:first-child td),
.content::v-deep(table tbody:first-of-type tr:first-child th),
.content::v-deep(table tbody:first-of-type tr:not(:first-child) td),
.content::v-deep(table tbody:not(:first-child) td),
.content::v-deep(table thead tr:first-child td),
.content::v-deep(table thead tr:first-child th) {
  height: 9px !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-bottom: 3px solid #232323;
  border-right: 3px solid #232323;
  text-align: center;
}

.content::v-deep(table) {
  font-size: 13px;
  width: 100% !important;
  word-break: break-all;
  border-radius: 5px;
  border-collapse: separate;
  border-spacing: 0;
  border: 3px solid #232323 !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #1a1a1a;
}

.content::v-deep(table p),
.content::v-deep(table span) {
  color: inherit;
}

.content::v-deep(table td) {
  padding: 18.5px;
}

.content::v-deep(table tr td:last-child) {
  border-right: none !important;
}

.content::v-deep(table tr:last-child td) {
  border-bottom: none !important;
}

.content::v-deep(table tbody:first-of-type tr:first-child td),
.content::v-deep(table tbody:first-of-type tr:first-child th) {
  background-color: #1a1a1a !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.content::v-deep(table tbody:not(:first-child) td) {
  background-color: #000;
}

.content::v-deep(summary) {
  position: relative;
}
</style>
