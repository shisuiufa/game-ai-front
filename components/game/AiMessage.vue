<script setup lang="ts">
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
      <div v-if="show" class="flex gap-1">
        <div
            class="flex min-w-[32px] w-[32px] h-[32px] sm:min-w-[40px] sm:w-[40px] sm:h-[40px] rounded-full bg-blue-200 items-center justify-center font-medium text-white">
          🤖
        </div>

        <div class="flex flex-col max-w-full sm:max-w-96 bg-white rounded-lg p-2 sm:p-3 justify-center">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@keyframes blink {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
.animate-blink {
  animation: blink 1.4s infinite;
}
.delay-0 { animation-delay: 0s; }
.delay-200 { animation-delay: 0.2s; }
.delay-400 { animation-delay: 0.4s; }
</style>
