<script setup lang="ts">
import {ref} from 'vue'

const bets = [
  {
    id: 1,
    price: 100,
    disabled: false
  },
  {
    id: 2,
    price: 200,
    disabled: true
  },
  {
    id: 3,
    price: 500,
    disabled: true
  }
]
const selectedBet = ref(bets[0])

const {user} = useCurrentUser();

const profileStore = useProfileStore()

onMounted(() => profileStore.fetchProfile())
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center p-3 sm:p-8 bg-white rounded-2xl shadow-2xl space-y-6 border border-gray-100 w-full mx-auto">
    <!-- Заголовок -->
    <h2 class="text-3xl font-extrabold text-gray-900">Ready to play?</h2>
    <p class="text-gray-500 text-sm">Choose your stake and find a game</p>

    <!-- 💰 Баланс -->
    <div class="flex items-center gap-3 px-6 py-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm text-sm font-medium">
      <Icon name="i-heroicons-wallet" class="w-5 h-5" />
      <span>Balance:</span>
      <span class="font-semibold">{{ user?.points ?? 0 }} ₽</span>
    </div>

    <!-- 🎯 Ставки -->
    <div class="flex items-center justify-center gap-2 sm:gap-4 w-full">
      <button
          v-for="amount in bets"
          :key="amount.id"
          @click="selectedBet = amount"
          :disabled="amount.disabled"
          class="flex flex-1 sm:flex-none items-center justify-center gap-2 px-1 sm:px-6 py-2 sm:py-3 rounded-full transition-all font-semibold text-xs sm:text-sm border"
          :class="[
          amount.disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : selectedBet.id === amount.id
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-indigo-500 shadow-lg'
              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm'
        ]"
      >
        <Icon name="i-heroicons-banknotes" class="w-5 h-5" />
        {{ amount.price }} ₽
      </button>
    </div>

    <!-- 🚀 Кнопка старта -->
    <UButton
        @click="$emit('start', selectedBet)"
        icon="i-heroicons-play"
        class="px-4 py-2 sm:px-8 sm:py-3 font-bold text-white text-sm sm:text-base bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg"
    >
      Start Game
    </UButton>
  </div>
</template>



