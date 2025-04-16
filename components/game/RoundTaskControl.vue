<script setup lang="ts">

import type {Form, FormSubmitEvent} from '#ui/types';
import {z} from 'zod';

const {$gameWs} = useNuxtApp();

const {user} = useCurrentUser();

const schema = z.object({
  answer: z.string().min(2, 'Must be at least 1 characters').max(200, 'Must be no more than 200 characters'),
})

type Schema = z.output<typeof schema>

const form = ref<Form<Schema>>();

const state = ref<Partial<Schema>>({});

const haveAnswer = computed(() => {
  return $gameWs.answers?.value.some(item => item.userId == user.value.id) || false;
});

const isValidSchema = computed(() => {
  return schema.safeParse(state.value).success && !haveAnswer.value
});

let typingTimeout: ReturnType<typeof setTimeout> | null = null;

const answerLength = computed(() => state.value.answer?.length || 0);

const submitAnswer = (event: FormSubmitEvent<Schema>) => {
  $gameWs.sendAnswer(event.data.answer)
  state.value.answer = '';
}

const onInput = () => {
  $gameWs.typing(true);
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    $gameWs.typing(false);
  }, 1000);
};

</script>

<template>
  <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="flex flex-col gap-1"
      @submit="submitAnswer"
  >
    <div class="flex items-center w-full sm:h-10 items-end gap-2">
      <UiAppInput
          maxlength="200"
          :disabled="haveAnswer"
          v-model="state.answer"
          type="text"
          placeholder="Type an answer..."
          class="w-full relative h-full"
          @input="onInput"
      />

      <UiAppButton
          icon="i-heroicons-paper-airplane"
          :disabled="!isValidSchema"
          type="submit"
          class="self-end h-full"
      />
    </div>

    <div
        class="text-xs text-right font-medium"
        :class="{
        'text-gray-400': answerLength < 180,
        'text-yellow-500': answerLength >= 180 && answerLength < 200,
        'text-red-400': answerLength === 200,
      }"
    >
      {{ answerLength }}/200 characters
    </div>
  </UForm>
</template>


