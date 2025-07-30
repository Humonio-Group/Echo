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
    <Avatar class="size-9 mt-2">
      <AvatarImage
        v-if="!senderName.startsWith('user')"
        src="/images/ia-avatar.gif"
      />
      <AvatarFallback class="text-sm">
        {{ senderName.substring(0, 2) }}
      </AvatarFallback>
    </Avatar>

    <div
      class="py-3 px-4 w-fit max-w-[75%] bg-accent text-accent-foreground rounded-xl"
      :class="{ 'bg-primary text-primary-foreground': inverted }"
    >
      <p class="whitespace-pre-line">
        <slot />
      </p>
    </div>
  </div>
</template>
