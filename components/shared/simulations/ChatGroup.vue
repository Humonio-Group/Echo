<script setup lang="ts">
import ChatBubble from "~/components/shared/simulations/ChatBubble.vue";

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
    setupLoop();
  }, 10);
});

const scrollTrigger = ref();
const interval = ref();

function scrollBottom() {
  (scrollTrigger.value as HTMLElement).scrollIntoView({ behavior: "smooth" });
  console.log("scroll bottom of the chat");
}
function setupLoop() {
  if (interval.value) clearInterval(interval.value);
  interval.value = setInterval(scrollBottom, 5000);
}

onNuxtReady(() => {
  setupLoop();
});
onBeforeUnmount(() => {
  if (!interval.value) return;
  clearInterval(interval.value);
});
</script>

<template>
  <div class="flex-1 flex flex-col py-5 px-4 overflow-auto gap-2">
    <ChatBubble
      v-for="entry in messages"
      :key="entry.id"
      :sender-name="entry.senderId"
      :inverted="entry.senderId !== 'ia'"
    >
      {{ entry.message }}
    </ChatBubble>

    <div
      ref="scrollTrigger"
      class="h-0 -mt-2"
    />
  </div>
</template>
