<script setup lang="ts">
import type {AnswerResource} from "~/resource/game";

const props = defineProps<{
  item: AnswerResource | null
}>();

const show = ref(false);

const currentUser = useCurrentUser();

const isUserAnswer = computed(() => {
  return props.item.userId == currentUser.value.id;
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
      <div v-if="show" class="flex gap-2">
        <div :class="[
        'flex max-w-96 px-4 rounded-lg py-2 gap-3 shadow min-h-[40px] transition-colors duration-300',
        isUserAnswer ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 order-last'
      ]"
        >
          <div v-if="item?.hidden" :key="'hidden-' + item.userId"
               class="flex items-center gap-2 text-sm italic text-gray-500">
            <Icon name="i-heroicons-lock-closed" class="w-4 h-4 text-gray-400"/>
            Answer hidden until round ends
          </div>

          <p v-else :key="'visible-' + item.userId" class="leading-relaxed">
            {{ item.answer }}
          </p>
        </div>

        <div class="w-9 h-9 rounded-full flex items-center justify-center">
          <img
              src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="Avatar"
              class="w-9 h-9 rounded-full"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>



