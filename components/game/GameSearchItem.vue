<script setup lang="ts">
import { UserStatus, type WsUserResource } from "~/resource/user";

const props = defineProps<{ item: WsUserResource }>();

const statusLabel = computed(() => {
  if (props.item.status === UserStatus.Ready) return "Готов";
  if (props.item.status === UserStatus.Search) return "В поиске";
  return "Неизвестно";
});

const statusColor = computed(() => {
  if (props.item.status === UserStatus.Ready) return "text-green-500";
  if (props.item.status === UserStatus.Search) return "text-yellow-500";
  return "text-gray-500";
});
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 flex flex-col justify-center items-center gap-3 transition hover:shadow-md">
    <div class="w-64 h-64 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl">
      {{ item.username?.[0]?.toUpperCase() ?? "?" }}
    </div>

    <div class="text-2xl font-semibold text-gray-800 text-center">
      {{ item.username ?? "Игрок" }}
    </div>

    <div :class="['text-xl font-medium', statusColor]">
      {{ statusLabel }}
    </div>
  </div>
</template>
