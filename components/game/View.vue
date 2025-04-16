<script setup lang="ts">
import {type AnswerResource, type TaskResource, WsAnswers} from "~/resource/game";
import {type WsUserResource} from "~/resource/user";
import type {ResultResource} from "~/resource/result";
import AIMessageError from "~/components/game/AIMessageError.vue";

const props = defineProps<{
  task?: TaskResource | null,
  answers?: AnswerResource[] | null,
  winner?: WsUserResource | null,
  opponentTyping: boolean,
  users: WsUserResource[]
  status: number,
  result: ResultResource,
  message: string | null
  prompt: string | null
}>();

const {user} = useCurrentUser();

const opponent = computed(() => {
  return props.users.find(u => u.id !== user.id) || '';
});

const sortedAnswers = computed(() => {
  return [...props.answers].sort((a, b) => a.time - b.time);
});
</script>

<template>
  <div class="h-full rounded-xl">
    <div class="bg-black/5 min-h-full h-auto p-4 flex flex-col gap-4 text-base font-medium">
      <GameTaskAi v-if="task || (!task && status !== WsAnswers.GAME_ERROR)" :task="task" />
      <GameAnswerItem v-for="(item, idx) in sortedAnswers" :key="idx" :item="item"/>
      <GameOpponentTyping v-if="opponentTyping && opponent && !winner" :opponent="opponent"/>
      <GameResult v-if="status == WsAnswers.GAME_GENERATE_RESULT || status == WsAnswers.GAME_END"
                  :winner="winner"
                  :result="result"
                  :prompt="prompt"
      />
      <AIMessageError v-if="status === WsAnswers.GAME_ERROR" :message="message"/>
    </div>
  </div>
</template>
