<script setup lang="ts">
definePageMeta({
  layout: "announcement",
  game: "hk4e",
});
const { data, status, error } = await useLazyFetch("/api/announcement/hk4e");
const progressValue = computed(() => {
  if (!data.value?.progress.percent) {
    return 0;
  }
  return data.value.progress.percent * 100;
});
</script>

<template>
  <div>
    <div v-if="status === 'success'">
      <div v-if="data?.progress.percent" class="my-4">
        <UProgress v-model="progressValue" class="h-2" />
        <span>
          {{ data.progress.start_time }} ~ {{
            appendAnnotation(data.progress.end_time, data.progress.end_time_humaize)
          }}
        </span>
      </div>
      <div v-for="item in data?.gacha_info" :key="item.ann_id">
        <Hk4eContentModal :item="item">
          <div class="aspect-[1080/533]">
            <img
              :src="ossProcessWebp(item.image)"
              :alt="item.title"
            >
          </div>
          <p>{{ item.title }}</p>
          <p>
            开始时间:
            {{ appendAnnotation(item.start_time, item.start_time_humaize) }}
          </p>
          <p>
            结束时间:
            {{ appendAnnotation(item.end_time, item.end_time_humaize) }}
          </p>
        </Hk4eContentModal>
      </div>
    </div>
    <div v-if="status === 'error'" class="my-4">
      <span>获取失败</span>
      <pre>
        <code>
          {{ String(error) }}
        </code>
      </pre>
    </div>
    <div v-if="status === 'pending'" class="my-4">
      <LoadingAnnouncement />
    </div>
  </div>
</template>
