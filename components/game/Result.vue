<script setup lang="ts">
import type {WsUserResource} from "~/resource/user";
import type {ResultResource} from "~/resource/result";
import AiMessage from "~/components/game/AiMessage.vue";

const props = defineProps<{
  winner?: WsUserResource | null,
  result?: ResultResource | null
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
  <div class="flex flex-col gap-4">
    <AiMessage>
      <div v-if="winner" class="flex flex-col max-w-96 bg-white rounded-lg gap-2">
        <p class="text-gray-700">
          🏆 The winner is {{ winner.username }}
        </p>

        <p v-if="sortedResult" class="text-gray-700">
          {{winnerScore ?? 0}}% vs {{loserScore ?? 0}}%.
        </p>
      </div>

      <template v-else>
        <div class="flex items-center gap-1.5 text-gray-500 text-sm">
          <div class="text-sm text-gray-600 animate-pulse">
            Determining the winner...
          </div>
        </div>
      </template>
    </AiMessage>
    <AiMessage v-if="winner">
      <p class="text-gray-700">
        💰 The prize of 100 rub goes to {{ winner.username }}
      </p>
    </AiMessage>
  </div>

</template>
