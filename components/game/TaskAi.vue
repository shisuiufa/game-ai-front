<script setup lang="ts">
import type { TaskResource } from "~/resource/game";

defineProps<{ task?: TaskResource | null }>();

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

      <div class="flex flex-col max-w-96 bg-white rounded-lg p-3 justify-center">
        <template v-if="task">
          <img class="object-contain w-80 h-80" :src="task.image" alt="image ai" />
          <p class="text-gray-700">
            {{ task.question }}
          </p>
        </template>

        <template v-else>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </template>
      </div>
    </div>
    </Transition>
  </div>
</template>
