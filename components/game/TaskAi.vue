<script setup lang="ts">
import type {TaskResource} from "~/resource/game";
import AiMessage from "~/components/game/AiMessage.vue";

defineProps<{ task?: TaskResource | null }>();

const imageLoaded = ref(false)
</script>

<template>
  <AiMessage padding="p-0">
    <template v-if="task" class="flex flex-col justify-center items-center">
      <div class="w-full h-auto m-auto">
        <USkeleton v-if="!imageLoaded" class="w-full h-40 sm:h-64 aspect-square" />
        <img v-show="imageLoaded" @load="imageLoaded = true" class="object-contain w-full h-full" :src="task.image" alt="image ai"/>
      </div>
      <p class="text-pretty text-gray-700 p-2 sm:p-3 text-xs sm:text-base">
        {{ task.question }}
      </p>
    </template>

    <template v-else>
      <div class="flex items-center gap-1.5 p-2 sm:p-3">
        <div class="text-gray-600 animate-pulse text-xs sm:text-base">
          Please wait, I’m creating the Prompt and the image...
        </div>
      </div>
    </template>
  </AiMessage>
</template>
