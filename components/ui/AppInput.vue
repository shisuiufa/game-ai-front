<script setup lang="ts">

</script>

<template>
  <UInput
      :ui="{
        wrapper: 'relative h-full',
        base: 'relative block w-full h-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
        icon: { trailing: { pointer: '' } }
      }">
    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing"/>
    </template>
  </UInput>
</template>
