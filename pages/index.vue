<script setup lang="ts">
import AppButton from "~/components/ui/AppButton.vue";
import {WebSocketStatus} from "~/constants/WebSocketStatus";

const { $gameWs } = useNuxtApp();
const user = useCurrentUser()

const findGame = () => {
  $gameWs.findGame(user.value.username);
};

const status = computed(() => $gameWs.status.value);
</script>

<template>
    <div class="pt-7">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <Icon name="i-heroicons-user-20-solid" class="w-5 h-5"/>
            <h1>
              Players: 0
            </h1>
          </div>
        </template>

        <GameSearch/>

        <template #footer>
          <AppButton v-if="status === WebSocketStatus.CONNECTED" @click="findGame">
            Find game
          </AppButton>
        </template>
      </UCard>
    </div>
</template>

