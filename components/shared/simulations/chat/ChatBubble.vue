<script setup lang="ts">
defineProps<{
  senderName: string;
  inverted?: boolean;
}>();
</script>

<template>
  <div
    class="flex items-start gap-4"
    :class="{ 'flex-row-reverse': inverted }"
  >
    <div
      class="py-3 px-4 w-fit max-w-[75%] bg-accent text-accent-foreground rounded-xl"
      :class="{ 'bg-primary text-primary-foreground': inverted }"
    >
      <p class="whitespace-pre-line">
        <slot name="message" />
      </p>

      <span class="text-muted-foreground text-xs">
        <slot name="timestamp" />
      </span>
    </div>
  </div>
</template>
