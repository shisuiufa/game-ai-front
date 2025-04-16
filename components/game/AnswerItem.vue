<script setup lang="ts">
import type {AnswerResource} from "~/resource/game";

const props = defineProps<{
  item: AnswerResource | null
}>();

const show = ref(false);

const {user} = useCurrentUser();

const isUserAnswer = computed(() => {
  return props.item.userId == user.value.id;
});

setTimeout(() => {
  show.value = true;
}, 200)
</script>

<template>
  <div :class="isUserAnswer ? 'justify-end' : 'justify-start'" class="flex gap-2 items-end">
    <Transition
        appear
        enter-active-class="transition-all duration-500 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 translate-y-6 scale-90 blur-sm"
        enter-to-class="opacity-100 translate-y-0 scale-100 blur-0"
        leave-from-class="opacity-100 translate-y-0 scale-100 blur-0"
        leave-to-class="opacity-0 translate-y-2 scale-95 blur-sm"
    >
      <div v-if="show" class="flex items-start gap-2">
        <div :class="['flex-inline p-2 sm:p-3 rounded-lg gap-3 shadow transition-colors duration-300',isUserAnswer ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 order-last']">
          <div v-if="item?.hidden" :key="'hidden-' + item.userId"
               class="flex items-center gap-2 text-xs sm:text-base italic text-gray-500">
            <Icon name="i-heroicons-lock-closed" class="w-4 h-4 text-gray-400"/>
            Answer hidden until round ends
          </div>
          <p v-else :key="'visible-' + item.userId" class="break-all max-w-full sm:max-w-96 leading-relaxed break-words whitespace-pre-wrap">
            {{ item.answer }}
          </p>
        </div>
        <UAvatar class="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]" :ui="{size: {sm: 'w-full h-full'}}" src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" size="sm" />
      </div>
    </Transition>
  </div>
</template>



