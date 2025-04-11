<script setup lang="ts">
import type {WsUserResource} from "~/resource/user";

defineProps<{
  winner?: WsUserResource | null
}>();

const show = ref(false);

setTimeout(() => {
  show.value = true;
}, 200)
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
        <div class="w-9 h-9 rounded-full bg-red-200 flex items-center justify-center mr-2 font-medium text-sm text-white">
          AI
        </div>
        <div class="flex flex-col max-w-96 bg-white rounded-lg p-3 gap-3">
          <p class="text-gray-700">
            🏆 Победитель: {{ winner.username }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>
