<script setup lang="ts">
import type {AnswerResource, TaskResource} from "~/resource/game";
import {type WsUserResource} from "~/resource/user";

const props = defineProps<{
  task?: TaskResource | null,
  answers?: AnswerResource[] | null,
  winner?: WsUserResource | null,
  opponentTyping: boolean,
  users: WsUserResource[]
}>();

const currentUser = useCurrentUser();

const opponent = computed(() => {
  return props.users.find(u => u.id !== currentUser.id) || '';
});
</script>

<template>
  <div class="h-full rounded-xl">
    <div class="bg-black/5 min-h-full h-auto p-4 flex flex-col gap-4 text-base font-medium">
      <GameTaskAi :task="task" />
      <GameOpponentTyping v-if="opponentTyping && opponent" :opponent="opponent"/>
      <GameAnswerItem v-for="(item, idx) in answers" :key="idx" :item="item"/>
      <GameResult v-if="winner" :winner="winner"/>
    </div>
  </div>
</template>
