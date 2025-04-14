<script setup lang="ts">
import {WebSocketStatus} from "~/constants/WebSocketStatus";

defineProps<{
  message: string
}>()

const {$gameWs} = useNuxtApp();

const retryGame = () => {
  $gameWs.leaveGame();
  $gameWs.ensureConnectedAndFindGame();
}

const show = ref(false)

setTimeout(() => (show.value = true), 150)
</script>

<template>
  <Transition
      appear
      enter-active-class="transition-all duration-500 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 translate-y-6 scale-90 blur-sm"
      enter-to-class="opacity-100 translate-y-0 scale-100 blur-0"
      leave-from-class="opacity-100 translate-y-0 scale-100 blur-0"
      leave-to-class="opacity-0 translate-y-2 scale-95 blur-sm"
  >
    <div v-if="show" class="flex">
      <div class="w-9 h-9 rounded-full bg-red-200 flex items-center justify-center mr-2 font-medium text-sm text-white">
        AI
      </div>

      <div class="flex flex-col max-w-96 bg-white rounded-lg p-3 justify-center">
        <p class="text-sm text-red-600 leading-relaxed">
          {{ message }} 😢
        </p>
        <UButton
            @click="retryGame"
            class="mt-3 py-1.5 text-center"
        >
          <p class="w-full">
            🔍 Попробовать ещё раз
          </p>
        </UButton>
      </div>
    </div>
  </Transition>
</template>
