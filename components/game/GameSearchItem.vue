<script setup lang="ts">
import { UserStatus, type WsUserResource } from "~/resource/user";

const props = defineProps<{ item: WsUserResource }>();

const statusLabel = computed(() => {
  if (props.item.status === UserStatus.Ready) return "Ready";
  if (props.item.status === UserStatus.Search) return "Searching";
  return "Unknown";
});

const statusColor = computed(() => {
  if (props.item.status === UserStatus.Ready) return "text-green-500";
  if (props.item.status === UserStatus.Search) return "text-yellow-500";
  return "text-gray-500";
});
</script>

<template>
  <div class="bg-white rounded-xl shadow p-2 sm:p-4 flex flex-col justify-center items-center gap-3 transition hover:shadow-md">
    <div class="w-24 h-24 sm:w-40 sm:h-40 md:w-64 md:h-64 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl">
      {{ item.username?.[0]?.toUpperCase() ?? "?" }}
    </div>

    <div class="text-xs sm:text-xl md:text-2xl font-semibold text-gray-800 text-center">
      {{ item.username ?? "Player" }}
    </div>

    <div :class="['text-xs sm:text-xl md:text-xl font-medium', statusColor]">
      {{ statusLabel }}
    </div>
  </div>
</template>
