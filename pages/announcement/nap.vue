<template>
  <div>
    <div v-if="status === 'success'">
      <div v-if="data?.progress.percent" class="my-4">
        <UProgress
          class="h-2"
          :value="progressValue"
          :ui="{ progress: { color: 'dark:text-[#d9a600] text-[#050505]' } }"
        ></UProgress>
        <span
          >{{ data.progress.start_time }} ~ {{ data.progress.end_time }} ({{
            data.progress.end_time_humaize
          }})</span
        >
      </div>
      <div v-else class="my-4">
        <UProgress class="h-2" :value="progressValue"></UProgress>
        <span>获取版本信息失败</span>
      </div>

      <div
        v-for="item in data?.gacha_info"
        :key="item.ann_id"
        @click="openModal(item)"
      >
        <img v-for="(i, index) in item.images" :key="index" :src="i" :alt="i" />
        <p>{{ item.title }}</p>
        <p>开始时间: {{ item.start_time }} ({{ item.start_time_humaize }})</p>
        <p>结束时间: {{ item.end_time }} ({{ item.end_time_humaize }})</p>
      </div>
    </div>
    <div v-if="status == 'error'" class="my-4">
      <span>获取失败</span>
      <pre>
        <code>
          {{ String(error) }}
        </code>
      </pre>
    </div>
    <div v-if="status == 'pending'" class="my-4">
      <LoadingAnnouncement />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NapContentModal } from "#components";

definePageMeta({
  layout: "announcement",
});
const { data, status, error } = await useLazyFetch("/api/announcement/nap");
const progressValue = computed(() => {
  if (!data.value?.progress.percent) {
    return 0;
  }
  return data.value.progress.percent * 100;
});
const modal = useModal();

function openModal(item: { title?: string | null; content?: string | null }) {
  if (document.getSelection()?.isCollapsed === false) {
    return;
  }
  if (document.getSelection()?.isCollapsed === false) {
    return;
  }
  modal.open(NapContentModal, {
    title: item.title,
    content: item.content?.replaceAll(/font-size:0.\d+rem/g, "font-size:1rem"),
  });
}
</script>
