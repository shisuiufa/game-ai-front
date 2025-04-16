<script setup lang="ts">
import type {WsUserResource} from "~/resource/user";

const show = ref(false);

defineProps<{
  opponent: WsUserResource
}>()

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
      <div v-if="show" class="flex gap-2">
        <div class="flex items-center px-2 sm:px-4 rounded-lg py-2 sm:py-3 gap-1 sm:gap-3 shadow transition-colors duration-300 bg-white text-gray-800 order-last"
        >
          <div class="flex gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0s;"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.2s;"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.4s;"></span>
          </div>
        </div>

        <UAvatar class="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]" :ui="{size: {sm: 'w-full h-full'}}" src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" size="sm" />
      </div>
    </Transition>
  </div>
</template>
