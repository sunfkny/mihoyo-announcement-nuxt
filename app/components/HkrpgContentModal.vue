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
    class="divide-neutral-300 dark:divide-neutral-300"
    :ui="{
      content: 'bg-[#D9DEEA] border-none shadow text-gray-800 max-w-screen sm:max-w-5xl',
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
        class="content useWebFont scroll-hack mask max-h-[calc(100vh-14rem)] min-h-4 pr-2 overflow-y-auto"
        v-html="resolveTimeAndResetFontSize(item.content)"
      />
    </template>
  </UModal>
</template>

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
  margin-top: 4px;
  margin-bottom: 24px;
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

.mask {
  mask-image: -webkit-linear-gradient(transparent, #000 1%, #000 95%, transparent);
  -webkit-mask-image: -webkit-gradient(linear,left top,left bottom,from(transparent),color-stop(1%,#000),color-stop(95%,#000),to(transparent));
  -webkit-mask-image: -webkit-linear-gradient(transparent,#000 1%,#000 95%,transparent)
}

.content ::v-deep(details > summary::marker) {
  content: "";
  display: none;
}

.content ::v-deep(details>summary) {
    padding-right: 2rem;
    box-sizing: border-box;
    margin-bottom: .4rem;
    cursor: pointer;
}

.content ::v-deep(details > summary::marker) {
  content: "";
  display: none;
}

.content ::v-deep(details > summary:after) {
  position: absolute;
  display: block;
  content: "";
  top: 50%;
  right: .5rem;
  width: .9rem;
  height: .9rem;
  -webkit-transform: translateY(calc(-.1rem - 50%));
  -ms-transform: translateY(calc(-.1rem - 50%));
  transform: translateY(calc(-.1rem - 50%));
  -webkit-transition: -webkit-transform .3s ease-in-out;
  transition: -webkit-transform .3s ease-in-out;
  -o-transition: transform .3s ease-in-out;
  transition: transform .3s ease-in-out;
  transition: transform .3s ease-in-out,-webkit-transform .3s ease-in-out;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAABNVBMVEVHcEz6u1r6u1r6u1r6ulr/qlX5uln6u1r6u1r/xlX6u1n7vFr7vFn4tlf6ulr6u1n6ulr6vVr6uln/tlX/vFn0vFn6u1r6ulr5u1r6u1r5vFr4vFr6u1r/v0D6ulj6u1n4u1n7u1n6u1r7u1rztlX6vFr/wlX/vFr7u1r/vVf6uln6u1n8vFn6u1r6u1n6u1r6u1r////6vF3+6sv6w23+6sz//v3+79j6u1v7zoj6vWD//fr+7NL81pv926f6vmH6wWr6v2T6vV7+9+v95L3++O76xG/6vF7+8t/+79n+683+9ej6xHH//vz6wmv//v7+7tb70I76vV/+9+z+9eb+69D+8uD+6cr//fv7xXL+7dT//fz6v2P81Jf6vmL80ZH7z4v805T93rD++O/+8Nv+9ur7xXMqKwxTAAAAMHRSTlMAys3RnANc/tcJpkRII8z77mzIFRcX/PzYpFsixwRo/m3tpe0VzBUi6yPF+FzEyGyYiO0nAAABYElEQVQ4y5WU1XrCQBCFh0AECE6xForUdU4q1N3d3e39H6EXJSECJD1XZ7P/t5PdESKTBkt5oRKLVYR8qZtaSiz0yGyod7wgOhlVYZsU1YYEAzI7JAeCZqYryi0VTTeZPoXbSEkZsXzcVj49YoA7KPDHhOVOkBwmIhIV7ihFJCKJXSQRUY8blCSKyG6QHKFJYzFn2TKtEhTS7fTNm4lZ25s3fIj8DXe/ibtz4/vJFRYNyk/xhtsC8Piqn3oIoK5DNco2nHYL4PidmZl3vgF8retQjEZ1q00BmH1m5qNLAPtPRuwsDbGVWuafbQD1l+YlasaP69TpxyeAs1XTTf3NJ9ApAHhYMD9ZiBLspJYsDCdsadFmAFxf2NNCSbZRBxuOBNtLRVvZtSV4zGvReSpfb43graUo1b45B9zbvD/934FBRGrOzuRU54AqShPmITYiFVsPu+FyVYhnMnGhWraMw188IL5o6gtsBwAAAABJRU5ErkJggg==) no-repeat 50%/100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box
}

.content ::v-deep(details[open] > summary:after) {
  transform: translateY(calc(-.01rem - 50%)) rotate(-180deg)
}
</style>
