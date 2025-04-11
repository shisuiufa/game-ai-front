<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types';
import { z } from 'zod';
import AppButton from "~/components/ui/AppButton.vue";
import AppInput from "~/components/ui/AppInput.vue";

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type Schema = z.output<typeof schema>;

const profileStore = useProfileStore();

const { loading } = storeToRefs(profileStore);

const form = ref<Form<Schema>>();
const state = ref<Partial<Schema>>({});
const showPassword = ref(false);

const router = useRouter();

const submit = async (event: FormSubmitEvent<Schema>) => {
  if (loading.value) return;
  await profileStore.register(event.data);
  await router.push("/");
};
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" class="space-y-6" @submit="submit">
    <UFormGroup label="Username" name="username">
      <AppInput v-model="state.username" autocomplete="name" required/>
    </UFormGroup>

    <UFormGroup label="Email address" name="email">
      <AppInput v-model="state.email" autocomplete="email" required/>
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <AppInput v-model="state.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required>
        <template #trailing>
          <UButton
              v-show="state.password"
              color="gray"
              variant="link"
              :icon="showPassword ? 'i-heroicons-eye-slash-20-solid' : 'i-heroicons-eye-20-solid'"
              :padded="false"
              @click="showPassword = !showPassword"
          />
        </template>
      </AppInput>
    </UFormGroup>

    <AppButton class="w-full" :disabled="loading" type="submit">
      Sign up
    </AppButton>
  </UForm>
</template>
