<script setup lang="ts">
import AppButton from "~/components/ui/AppButton.vue";
import {WebSocketStatus} from "~/constants/WebSocketStatus";
import {WsAnswers} from "~/resource/game";
import CountdownTimer from "~/components/ui/CountdownTimer.vue";

const {$gameWs} = useNuxtApp();

const {task, answers, winner, status, users, opponentTyping, endAt, nowAt, result, message} = toRefs($gameWs);

const findGame = () => {
  $gameWs.ensureConnectedAndFindGame();
};

const title = computed(() => {
  switch (status.value) {
    case WebSocketStatus.CONNECTED:
      return "Ready to find a game";
    case WsAnswers.GAME_SEARCH:
      return "Searching for opponent...";
    case WsAnswers.GAME_START:
      return "Round started!";
    case WsAnswers.GAME_END:
      return "Game over!";
    default:
      return "Waiting...";
  }
});
const icon = computed(() => {
  switch (status.value) {
    case WebSocketStatus.CONNECTED:
      return "i-heroicons-link";
    case WsAnswers.GAME_SEARCH:
      return "i-heroicons-magnifying-glass";
    case WsAnswers.GAME_START:
      return "i-heroicons-cube";
    case WsAnswers.GAME_END:
      return "i-heroicons-flag";
    default:
      return "i-heroicons-question-mark-circle";
  }
});
</script>

<template>
  <div class="w-full h-full p-4">
    <UCard
        class="h-full flex flex-col shadow-lg rounded-2xl overflow-hidden"
        :ui="{
        body: {
          base: 'flex flex-col grow overflow-y-auto p-6 bg-gray-50'
        }
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Icon :name="icon" class="w-5 h-5"/>
            <span>{{ title }}</span>
          </div>
          <div class="flex gap-2">
            <CountdownTimer v-if="nowAt && endAt && status == WsAnswers.GAME_START" :endAt="endAt" :nowAt="nowAt"/>
            <AppButton
                v-if="status === WsAnswers.GAME_SEARCH || status === WsAnswers.GAME_START || status === WsAnswers.GAME_END"
                @click="$gameWs.leaveGame()"
                icon="i-heroicons-arrow-left-on-rectangle"
                color="red"
            >
              Exit
            </AppButton>
          </div>
        </div>
      </template>

      <GameSearch
          v-if="status === WsAnswers.GAME_SEARCH || status === WsAnswers.GAME_READY || status === WsAnswers.GAME_USER_JOINED"
          :users="users"
          class="h-full"
      />

      <GameView
          v-if="
          status === WsAnswers.GAME_START ||
          status === WsAnswers.GAME_END ||
          status === WsAnswers.GAME_GENERATE_TASK ||
          status === WsAnswers.GAME_JOINED ||
          status === WsAnswers.GAME_GENERATE_RESULT ||
          status === WsAnswers.GAME_ERROR"
          :task="task"
          :answers="answers"
          :winner="winner"
          :users="users"
          :status="status"
          :result="result"
          :opponentTyping="opponentTyping"
          :message="message"
          class="h-full"
      />

      <template #footer>
        <div class="flex items-center justify-between bg-white">
          <AppButton
              v-if="status === WebSocketStatus.DISCONNECTED"
              @click="findGame"
              icon="i-heroicons-magnifying-glass"
          >
            Find game
          </AppButton>

          <GameRoundTaskControl class="w-full" v-if="status === WsAnswers.GAME_START"/>
        </div>
      </template>
    </UCard>
  </div>
</template>


