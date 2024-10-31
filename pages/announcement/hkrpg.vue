<template>
  <div>
    <div v-if="status === 'success'">
      <div v-if="data?.progress.percent" class="my-4">
        <UProgress
          class="h-2"
          :value="progressValue"
          :ui="{ progress: { color: 'text-[#313131]' } }"
        ></UProgress>
        <span
          >{{ data?.progress.start_time }} ~ {{ data?.progress.end_time }} ({{
            data?.progress.end_time_humaize
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
        <img :src="item.image" :alt="item.title" />
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
import { HkrpgContentModal } from "#components";

definePageMeta({
  layout: "announcement",
});
const { data, status, error } = useLazyFetch("/api/announcement/hkrpg");
const progressValue = computed(() => {
  if (!data.value?.progress.percent) {
    return 0;
  }
  return data.value?.progress.percent * 100;
});
const modal = useModal();

function openModal(item: { title?: string | null; content?: string | null }) {
  modal.open(HkrpgContentModal, {
    title: item.title,
    content: item.content?.replaceAll(
      /(&lt;t class="t_.*?&gt;)(.*?)(&lt;\/t&gt;)/gi,
      (match, p1, p2) => {
        return `<span>${p2}</span>`;
      }
    ),
  });
}
</script>
