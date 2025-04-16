<script setup lang="ts">
import type {WsUserResource} from "~/resource/user";
import type {ResultResource} from "~/resource/result";
import AiMessage from "~/components/game/AiMessage.vue";

const props = defineProps<{
  winner?: WsUserResource | null,
  result?: ResultResource | null
  prompt?: string | null
}>();

const show = ref(false);

setTimeout(() => {
  show.value = true;
}, 200)

const sortedResult = computed(() => {
  if (!props.result || props.result.length < 2) return null;
  return [...props.result].sort((a, b) => b.score - a.score);
});


const winnerScore = computed(() =>
    sortedResult.value
        ? Number(sortedResult.value[0].score.toFixed(2))
        : null
);

const loserScore = computed(() =>
    sortedResult.value
        ? Number(sortedResult.value[1].score.toFixed(2))
        : null
);

</script>

<template>
  <div class="flex flex-col gap-2 sm:gap-4">
    <AiMessage v-if="winner && prompt">
      <p class="text-gray-700 text-xs sm:text-base">
        🔍 This is what the image was based on: {{ prompt }}
      </p>
    </AiMessage>
    <AiMessage>
      <div v-if="winner" class="flex flex-col max-w-96 bg-white rounded-lg gap-2">
        <p class="text-gray-700 text-xs sm:text-base">
          🏆 The winner is {{ winner.username }}
        </p>

        <p v-if="sortedResult" class="text-gray-700 text-xs sm:text-base">
          {{winnerScore ?? 0}}% vs {{loserScore ?? 0}}%.
        </p>
      </div>

      <template v-else>
        <div class="flex items-center gap-1.5 text-gray-500">
          <div class="text-gray-600 animate-pulse text-xs sm:text-base">
            Determining the winner...
          </div>
        </div>
      </template>
    </AiMessage>
    <AiMessage v-if="winner">
      <p class="text-gray-700 text-xs sm:text-base">
        💰 The prize of 100 rub goes to {{ winner.username }}
      </p>
    </AiMessage>
  </div>

</template>
