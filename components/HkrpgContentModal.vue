<template>
  <UModal
    v-model:open="open"
    :title="item.title"
    :ui="{
      body: 'bg-[#D9DEEA] rounded-lg text-white',
      content: 'max-w-[1024px]',
      close: 'static',
      header: 'justify-between',
    }"
  >
    <div @click="click()">
      <slot></slot>
    </div>
    <template #body>
      <div
        class="content useWebFont scroll-hack max-h-[calc(100vh-14rem)] min-h-4 overflow-y-auto"
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
  "rpgWebFont",
  "https://webstatic.mihoyo.com/common/clgm-static/sr/fonts/zh-cn.ttf",
  {
    display: "swap",
  }
);

const { open, click } = useClickToggleIgnoreSelection();
</script>

<style scoped>
.useWebFont {
  font-family:
    rpgWebFont,
    Microsoft YaHei,
    "微软雅黑",
    Arial,
    sans-serif;
}

.scroll-hack--light::-webkit-scrollbar,
.scroll-hack::-webkit-scrollbar {
  width: 7px;
}

.scroll-hack--light::-webkit-scrollbar-thumb,
.scroll-hack::-webkit-scrollbar-thumb {
  background: #9a9da4;
  border-radius: 2.5px;
}

.scroll-hack--light::-webkit-scrollbar-track,
.scroll-hack::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.14);
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}

.scroll-hack--light::-webkit-scrollbar-track {
  border-left-color: #dcdcdc !important;
  border-right-color: #dfdfdf !important;
}

.content {
  color: #767676;
  margin: 0;
  word-break: break-word;
  line-height: 22.4px;
}

.content ::v-deep(table tbody:first-of-type tr:first-child td),
.content ::v-deep(table tbody:first-of-type tr:first-child th),
.content ::v-deep(table thead tr:first-child td),
.content ::v-deep(table thead tr:first-child th) {
  background-color: #d0d0d0 !important;
  color: #9d8563 !important;
}

.content ::v-deep(table tbody:first-of-type tr:not(:first-child) td),
.content ::v-deep(table tbody:not(:first-child) td) {
  color: #767676;
}

.content ::v-deep(.table-cell),
.content ::v-deep(table tbody:first-of-type tr:first-child td),
.content ::v-deep(table tbody:first-of-type tr:first-child th),
.content ::v-deep(table tbody:first-of-type tr:not(:first-child) td),
.content ::v-deep(table tbody:not(:first-child) td),
.content ::v-deep(table thead tr:first-child td),
.content ::v-deep(table thead tr:first-child th) {
  height: 28.8px !important;
  border: 1px solid #b4b6b6 !important;
  padding: 6.4px;
  box-sizing: border-box;
}

.content ::v-deep(table) {
  width: 100% !important;
  border-color: #b4b6b6 !important;
  text-align: center;
  word-break: break-all;
}

.content ::v-deep(img) {
  max-width: 100% !important;
  height: unset !important;
  margin: 22.4px auto;
}

.content ::v-deep(em),
.content ::v-deep(strong) {
  color: #ee970c;
  font-weight: 400;
}

.content ::v-deep(ul > li:before) {
  flex-shrink: 0;
  display: block;
  content: "";
  width: 4.8px;
  height: 4.8px;
  background-color: hsla(0, 0%, 46%, 0.8);
  border-radius: 50%;
  margin-right: 11.2px;
  margin-top: 8px;
}

.content ::v-deep(ul > li) {
  position: relative;
  display: flex !important;
  width: 100%;
  word-break: break-all;
}

.content ::v-deep(details > summary),
.content ::v-deep(h1) {
  position: relative;
  font-weight: 400;
  width: 100%;
  padding: 8px 1.6px 8px 20.8px;
  color: #9d8563;
  font-size: 19.2px;
  line-height: 22.4px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABWQAAAAUCAMAAAA9ScTlAAAAtFBMVEW0traAgIC0tra0tra0tra3t7e0trZHcEy0tra2tra0tra0tra0t7ezs7O0tLS1tbW0tra0tra0trafn5+zs7O1tbW1tbW0traytbW1tbW0traztbWvr6+2traztbW0traztra1tbWztbWztbW0trautbW0t7ezt7exsbG3t7e0ubm/v7+0tbW0travtbWqtra2traztbWztra0t7eztra0t7eztLS0tra1tra1uLi0tbW0trZCIVVjAAAAO3RSTlP2Ao+Tq0P3AOMH3/JVWzMw7fn4CCUmVv1WLfv5EEKsrltalOT0Jo6UDSczCI6SMBUV8q/erq2T7vdW5AU/wVIAAAGgSURBVHja7dzJcoIwAIBhFJTNXdC6723tvm+8/3s1EZgSi8HpOD393wkQLzn8wxASw1a5dcvrdJ6thWsDAI7gLmQ3vfxuGuppzYkSTo2RA4Bi+m4qkS2ZUYZZYvAAQK+om0pklXuj6JbhAwC9t4JuZiP7Ke+olq8urxvlqjw+Y/wAQKdX1M1MZN0v+UrhLj5pypcMK2a/AEDDXcluNjXdNGb++nW7O3yoVCqTcfrD4EPcXWcIAeCwunyOHaRn44nI6P3uMHxZP85CGVn5ePu+zflvWfxgMYQAcJglQnmTc33Tkm1tbZLIRkPjt5G43jcAAAf1RShHOdeH8TTYLI0sAOD0fCILAP8QWV4XAMDpXxc8JZFthUx8AcDpJr6CeOIrEJGd+r4V5n3CVeUTLgD44ydcgWjrNLDVxQjO/mIEh8UIAKARd7Op6WZ2WW28POy80e0my8PYiAsAtGpF3VQ2iFmq82Im4wcAemZBN9WtDi+y9y7Z6hAAChR1c2/T7t7P5rNswQUAR9B3cy+ytju3vHbbs+rMeQHAUdJuzvO6+Q0fyxk7nIgKJwAAAABJRU5ErkJggg==)
    no-repeat 100% 100% / calc(100% - 1.6px) auto;
  box-sizing: border-box;
  min-height: 41.6px;
}

.content ::v-deep(details > summary:before),
.content ::v-deep(h1:before) {
  position: absolute;
  display: block;
  content: "";
  width: 9.6px;
  height: 9.6px;
  left: 3.2px;
  top: 50%;
  transform: translateY(-50%);
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAz1BMVEVHcEyXgGCbg12dhGKdhGOdhWOdhWOdhWOdhWOdhWKdhGKchGOdhWKdhWKdiGKchWOagmCdhWKdhWSqgFWehmOehGGbg2GdhWKZiF2dhGKdhGKdhWOdhWObiWSchWOdhWOdhWKchGOcgmOdhGKYgmKehmOdhWSfh2WdhWOdhWKdhGOchWKdhGKah2CdhWOdhWKAgFWfgGCZmWabhGGehGOchWOchGOhhF6chGOdhGKchWOchWOZf12chGOdhWKbgGSchGOchmOdhWObg2SdhWNoxFChAAAARHRSTlMAICF4uf7y/Pj+pImSwC/9NW1zBqpZVKke5FP3+xz443N0MXIvv8A12HXYiIc11tcGIAVZbFpsG/Omd6UeqPkcH6inIX3lCZgAAADESURBVCjPfZLXEoJQDEQXBC9YsQsW7L33XvP/3+TDFVG4uE+ZPZNMJhuASz4otqZqk5GBb532jBy1W66fC1P1mJ/POGF1x0/rVKgAgNMU4/5aZytefcbVAKC4oxQ8IJkAcKYsvIDigMxKVz8gAyGKQACiUCgvAgOYJImAhjJlRICCgAqTbuJRClki0AteV2alrQB0gXvASVAM+4/IEgCw1NnGA5r/g+LRRixp8Q6j74YuPdxn6DR+/uQZUuyLqk2H47fxAu+1SCI75AjuAAAAAElFTkSuQmCC)
    no-repeat 50%/100% auto;
}
</style>
