<script setup lang="ts">
import type {WsUserResource} from "~/resource/user";
import type {ResultResource} from "~/resource/result";

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
  <div>
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
        <div
            class="w-9 h-9 rounded-full bg-red-200 flex items-center justify-center mr-2 font-medium text-sm text-white">
          AI
        </div>

        <div class="flex flex-col max-w-96 bg-white rounded-lg p-3 justify-center">
          <div v-if="winner" class="flex flex-col max-w-96 bg-white rounded-lg gap-2">
            <p class="text-gray-700">
              🏆 The winner is {{ winner.username }}
            </p>

            <p v-if="sortedResult" class="text-gray-700">
              {{winnerScore ?? 0}}% match vs. {{loserScore ?? 0}}%.
            </p>
          </div>

          <template v-else>
            <div class="flex items-center gap-1.5 text-gray-500 text-sm">
              <div class="text-sm text-gray-600 animate-pulse">
                Determining the winner...
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>
