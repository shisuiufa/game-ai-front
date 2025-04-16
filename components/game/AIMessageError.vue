<script setup lang="ts">
import AiMessage from "~/components/game/AiMessage.vue";

defineProps<{
  message: string
}>()

const {$gameWs} = useNuxtApp();

const retryGame = () => {
  $gameWs.leaveGame();
  $gameWs.ensureConnectedAndFindGame();
}
</script>

<template>
  <AiMessage>
    <p class="text-red-600 leading-relaxed">
      {{ message }} 😢
    </p>
    <UButton
        @click="retryGame"
        class="mt-1 sm:mt-3 py-1.5 text-center"
    >
      <p class="w-full">
        Try again 🔍
      </p>
    </UButton>
  </AiMessage>
</template>
