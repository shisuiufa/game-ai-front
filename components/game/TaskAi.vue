<script setup lang="ts">
import type {TaskResource} from "~/resource/game";
import AiMessage from "~/components/game/AiMessage.vue";

defineProps<{ task?: TaskResource | null }>();
</script>

<template>
  <AiMessage>
    <template v-if="task" class="flex flex-col justify-center items-center">
      <img class="object-contain w-40 h-40 sm:w-full sm:h-80 m-auto" :src="task.image" alt="image ai"/>
      <p class="text-pretty text-gray-700">
        {{ task.question }}
      </p>
    </template>

    <template v-else>
      <div class="flex items-center gap-1.5">
        <div class="text-gray-600 animate-pulse">
          Please wait, I’m creating the Prompt and the image...
        </div>
      </div>
    </template>
  </AiMessage>
</template>
