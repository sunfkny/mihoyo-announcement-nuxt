<template>
  <div>
    <div v-if="status === 'success'">
      <div v-if="data?.progress.percent" class="my-4">
        <UProgress
          class="h-2"
          :value="progressValue"
          :ui="{ progress: { color: 'dark:text-[#00c3ff] text-[#003366]' } }"
        ></UProgress>
        <span>
          {{ data.progress.start_time }} ~ {{ data.progress.end_time }} ({{
            data.progress.end_time_humaize
          }})</span
        >
      </div>
      <div
        v-for="item in data?.gacha_info"
        :key="item.ann_id"
        @click="openModal(item)"
      >
        <img :src="item.image" :alt="item.title" />
        <p>{{ item.title }}</p>
        <div v-if="item.info" v-html="item.info"></div>
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
import { Bh3ContentModal } from "#components";

definePageMeta({
  layout: "announcement",
});
const { data, status, error } = await useLazyFetch("/api/announcement/bh3");
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
  modal.open(Bh3ContentModal, {
    title: item.title,
    content: item.content,
  });
}
</script>
