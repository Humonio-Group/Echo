<script setup lang="ts">
import ChatBubble from "~/components/shared/simulations/chat/ChatBubble.vue";

const props = defineProps<{
  messages: {
    id: number;
    senderId: string;
    message: string;
  }[];
}>();
watch(props, () => {
  setTimeout(() => {
    scrollBottom();
  }, 10);
});

const scrollTrigger = ref();

function scrollBottom() {
  (scrollTrigger.value as HTMLElement)?.scrollIntoView({ behavior: "smooth" });
}

onNuxtReady(() => {
  scrollBottom();
});
</script>

<template>
  <div class="flex-1 flex flex-col py-5 px-4 overflow-auto gap-2">
    <template v-if="messages.length">
      <ChatBubble
        v-for="entry in messages"
        :key="entry.id"
        :sender-name="entry.senderId"
        :inverted="entry.senderId.startsWith('user')"
      >
        {{ entry.message }}
      </ChatBubble>
    </template>
    <template v-else>
      <p class="text-lg text-muted-foreground m-auto">
        {{ $t("labels.empty.messages") }}
      </p>
    </template>

    <div
      ref="scrollTrigger"
      class="h-0 -mt-2"
    />
  </div>
</template>
