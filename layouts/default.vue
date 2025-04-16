<script setup lang="ts">

</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center p-2 sm:p-4">
    <UContainer class="w-full h-full flex flex-col" :ui="{padding: 'px-0 sm:px-4'}">
      <slot/>
    </UContainer>
  </div>
</template>
