<script setup lang="ts">
import GameSearchItem from "~/components/game/GameSearchItem.vue";
import {UserStatus, type WsUserResource} from "~/resource/user";

const props = defineProps<{ users?: WsUserResource[] }>();

const items = computed(() => {
  const users = props.users ?? [];

  const [user1, user2] = users;

  return [
    {
      id: user1?.id ?? null,
      username: user1?.username ?? null,
      status: user1 ? UserStatus.Ready : UserStatus.Search,
    },
    {
      id: user2?.id ?? null,
      username: user2?.username ?? null,
      status: user2 ? UserStatus.Ready : UserStatus.Search,
    }
  ];
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <GameSearchItem v-for="(item, idx) in items" :key="idx" :item="item" />
  </div>
</template>

