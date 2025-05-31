<template>
  <div>
    <div v-if="status === 'success'">
      <div v-if="data?.progress.percent" class="my-4">
        <UProgress v-model="progressValue" class="h-2" color="info"></UProgress>
        <span
          >{{ data.progress.start_time }} ~ {{ data.progress.end_time }} ({{
            data.progress.end_time_humaize
          }})</span
        >
      </div>
      <div v-else class="my-4">
        <UProgress v-model="progressValue" class="h-2" color="info"></UProgress>
        <span>获取版本信息失败</span>
      </div>

      <div v-for="item in data?.gacha_info" :key="item.ann_id">
        <HkrpgContentModal :item="item">
          <div>
            <img :src="item.image" :alt="item.title" />
            <p>{{ item.title }}</p>
            <p>
              开始时间: {{ item.start_time }} ({{ item.start_time_humaize }})
            </p>
            <p>结束时间: {{ item.end_time }} ({{ item.end_time_humaize }})</p>
          </div>
        </HkrpgContentModal>
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
definePageMeta({
  layout: "announcement",
});
const { data, status, error } = await useLazyFetch("/api/announcement/hkrpg");
const progressValue = computed(() => {
  if (!data.value?.progress.percent) {
    return 0;
  }
  return data.value.progress.percent * 100;
});
</script>
