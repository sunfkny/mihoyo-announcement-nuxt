<template>
  <div>
    <div v-if="status === 'success'">
      <div v-if="data?.progress.percent" class="my-4">
        <UProgress v-model="progressValue" class="h-2" color="info" />
        <span>
          {{ data.progress.start_time }} ~ {{ data.progress.end_time }} ({{
            data.progress.end_time_humaize
          }})
        </span>
      </div>
      <div v-for="item in data?.gacha_info" :key="item.ann_id">
        <Bh3ContentModal :item="item">
          <img :src="item.image" :alt="item.title" />
          <p>{{ item.title }}</p>
          <div v-if="item.info" v-html="item.info"></div>
        </Bh3ContentModal>
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
const { data, status, error } = await useLazyFetch("/api/announcement/bh3");
const progressValue = computed(() => {
  if (!data.value?.progress.percent) {
    return 0;
  }
  return data.value.progress.percent * 100;
});
</script>
