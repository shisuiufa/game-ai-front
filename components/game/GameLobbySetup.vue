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
</script>

<template>
  <div
      class="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-200">
    <h2 class="text-2xl font-bold text-gray-900">Ready to play?</h2>
    <p class="text-gray-600 text-sm">Choose your stake and find a game!</p>

    <div class="flex gap-3">
      <UButton
          v-for="amount in bets"
          :key="amount.id"
          @click="selectedBet = amount"
          :disabled="amount.disabled"
          class="px-5 py-2 rounded-full border font-semibold flex items-center gap-2 transition-all"
          :class="[
            'px-5 py-2 rounded-full border font-semibold flex items-center gap-2 transition-all',
            amount.disabled
              ? 'text-white cursor-not-allowed'
              : selectedBet.id === amount.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-white'
          ]"
      >
        <Icon name="i-heroicons-banknotes" class="w-5 h-5"/>
        {{ amount.price }} ₽
      </UButton>
    </div>

    <UButton
        @click="$emit('start', selectedBet)"
        icon="i-heroicons-play"
        class="px-6 py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full hover:from-indigo-600 hover:to-violet-600 transition-all"
    >
      Start Game
    </UButton>
  </div>
</template>


