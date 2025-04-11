<script setup lang="ts">
import LoginForm from "~/components/form/LoginForm.vue";
import RegisterForm from "~/components/form/RegisterForm.vue";
import AppButton from "~/components/ui/AppButton.vue";

definePageMeta({
  layout: 'auth'
})

const selectedForm = ref('login');

const toggleForm = () => {
  if (selectedForm.value === 'login') {
    selectedForm.value = 'register';
  } else {
    selectedForm.value = 'login';
  }
}
</script>

<template>
  <UContainer class="w-full" :ui="{constrained: 'max-w-xl'}">
    <div class="sm:mx-auto sm:w-full ">
      <img class="mx-auto h-10 w-auto"
           src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        {{ selectedForm === 'login' ? 'Sign in to your account' : 'Create an account' }}
      </h2>
    </div>

    <LoginForm v-if="selectedForm === 'login'" class="mt-10"/>
    <RegisterForm v-else class="mt-10"/>

    <AppButton class="mt-2 w-full" @click="toggleForm">
      {{ selectedForm === 'login' ? "Don't have an account?" : "Already have an account? Sign in" }}
    </AppButton>
  </UContainer>
</template>

