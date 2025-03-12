<script setup lang="ts">

</script>

<template>
  <UInput
      :ui="{ icon: { trailing: { pointer: '' } } }"
      class="block w-full rounded-md bg-white text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing"/>
    </template>
  </UInput>
</template>
