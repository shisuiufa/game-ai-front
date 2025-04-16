<script setup lang="ts">
import AppButton from "~/components/ui/AppButton.vue";
import {WebSocketStatus} from "~/constants/WebSocketStatus";
import {WsAnswers} from "~/resource/game";
import CountdownTimer from "~/components/ui/CountdownTimer.vue";

const {$gameWs} = useNuxtApp();

const {task, answers, winner, status, users, opponentTyping, endAt, nowAt, result, message, prompt} = toRefs($gameWs);

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

const isInitializing = ref(true);

const showConnecting = computed(() =>
    isInitializing.value || status.value === WebSocketStatus.CONNECTING
);

const showSetup = computed(() =>
    status.value === WebSocketStatus.DISCONNECTED
);

const showExitButton = computed(() =>
    [WsAnswers.GAME_SEARCH, WsAnswers.GAME_END].includes(status.value)
);

const showGameSearch = computed(() =>
    [WsAnswers.GAME_SEARCH, WsAnswers.GAME_READY, WsAnswers.GAME_USER_JOINED].includes(status.value)
);

const showGameView = computed(() =>
    [
      WsAnswers.GAME_START,
      WsAnswers.GAME_END,
      WsAnswers.GAME_GENERATE_TASK,
      WsAnswers.GAME_JOINED,
      WsAnswers.GAME_GENERATE_RESULT,
      WsAnswers.GAME_ERROR,
    ].includes(status.value)
);

const showTaskControl = computed(() =>
    status.value === WsAnswers.GAME_START
);

const showCountdown = computed(() =>
    nowAt.value && endAt.value && status.value === WsAnswers.GAME_START
);

onMounted(() => {
  $gameWs.connect();
  isInitializing.value = false;
});
</script>

<template>
  <div class="w-full h-full">
    <GameLobbyConnecting
        class="w-full h-full"
        v-if="showConnecting"
    />

    <div v-else class="h-full w-full">
      <GameLobbySetup
          v-if="showSetup"
          class="h-full"
          @start="findGame"
      />
      <UCard v-else
             class="h-full flex flex-col shadow-lg rounded-2xl overflow-hidden"
             :ui="{
        body: {
          base: 'flex flex-col grow overflow-y-auto !py-0 !px-0 sm:py-0 sm:px-0 sm:p-0 bg-gray-50'
        },
        header: {
          padding: '!px-3 !py-3 !sm:px-4 !sm:py-5'
        },
        footer: {
          padding: '!px-3 !py-3 !sm:px-4 !sm:py-5'
        },
      }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs sm:text-lg font-semibold text-gray-800">
              <Icon :name="icon" class="w-4 h-4 sm:w-5 sm:h-5"/>
              <span>{{ title }}</span>
            </div>
            <div class="flex gap-2">
              <CountdownTimer v-if="showCountdown" :endAt="endAt" :nowAt="nowAt"/>
              <UButton
                  v-if="showExitButton"
                  size="sm"
                  @click="$gameWs.leaveGame()"
                  icon="i-heroicons-arrow-left-on-rectangle"
                  color="red"
              >
                Exit
              </UButton>
            </div>
          </div>
        </template>

        <GameSearch
            v-if="showGameSearch"
            :users="users"
            class="h-full"
        />

        <GameView
            v-if="showGameView"
            :task="task"
            :answers="answers"
            :winner="winner"
            :users="users"
            :status="status"
            :result="result"
            :opponentTyping="opponentTyping"
            :message="message"
            :prompt="prompt"
            class="h-full"
        />

        <Transition
            appear
            enter-active-class="transition-all duration-500 ease-out"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="-translate-y-6 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-4 opacity-0"
        >
          <div
              v-if="showTaskControl"
              class="flex items-center justify-between bg-white p-4 rounded shadow w-full"
          >
            <GameRoundTaskControl class="w-full" />
          </div>
        </Transition>
      </UCard>
    </div>
  </div>
</template>


