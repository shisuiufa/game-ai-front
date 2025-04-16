<script setup lang="ts">

import type {Form, FormSubmitEvent} from '#ui/types';
import {z} from 'zod';

const {$gameWs} = useNuxtApp();

const {user} = useCurrentUser();

const schema = z.object({
  answer: z.string().min(2, 'Must be at least 1 characters'),
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

const submitAnswer = (event: FormSubmitEvent<Schema>) => {
  $gameWs.sendAnswer(event.data.answer)
  state.value.answer = '';
}

const onInput = () => {
  $gameWs.typing(true);
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    $gameWs.typing(false);
  }, 500);
};
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" class="flex items-center gap-2 sm:h-10" @submit="submitAnswer">
    <UiAppInput :disabled="haveAnswer" v-model="state.answer" type="text" placeholder="Type a answer..." class="w-full h-full" @input="onInput"/>
    <UiAppButton icon="i-heroicons-paper-airplane" :disabled="!isValidSchema" type="submit" class="h-full" />
  </UForm >
</template>
