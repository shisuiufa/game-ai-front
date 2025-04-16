<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';

const props = defineProps<{
  endAt: number | null;
  nowAt?: number | null;
}>();

const timeLeft = ref(0);
const offset = ref(0); // Разница между клиентским и серверным временем (мс)
let interval: ReturnType<typeof setInterval>;

watch(() => props.nowAt, () => {
  if (props.nowAt) {
    offset.value = Date.now() - props.nowAt;
  }
}, { immediate: true });

const updateTimer = () => {
  if (!props.endAt) {
    timeLeft.value = 0;
    return;
  }

  const now = Date.now() - offset.value;
  const diff = Math.floor((props.endAt - now) / 1000);
  timeLeft.value = Math.max(diff, 0);
};

onMounted(() => {
  updateTimer();
  interval = setInterval(updateTimer, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});

const formattedTime = computed(() => {
  const clamped = Math.max(timeLeft.value, 0);
  const minutes = Math.floor(clamped / 60).toString().padStart(2, '0');
  const seconds = (clamped % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});
</script>

<template>
  <div class="text-sm sm:text-lg font-medium text-gray-600 flex items-center gap-1">
    <Icon name="i-heroicons-clock" class="w-4 h-4 text-gray-500" />
    <span>{{ formattedTime }}</span>
  </div>
</template>


