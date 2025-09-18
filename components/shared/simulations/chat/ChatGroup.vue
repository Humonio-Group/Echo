<script setup lang="ts">
import ChatBubble from "~/components/shared/simulations/chat/ChatBubble.vue";
import type { IConversation } from "~/types/conversations";

const props = defineProps<{
  conversation: IConversation;
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

const store = useRoomStore();
const { writing } = storeToRefs(store);

const simulator = computed(() => props.conversation?.simulator);

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
    <ChatBubble
      v-for="entry in messages"
      :key="entry.id"
      :sender-name="entry.senderId"
      :inverted="entry.senderId.startsWith('user')"
    >
      {{ entry.message }}
    </ChatBubble>
    <div
      v-if="writing"
      class="mt-auto py-3 px-3 w-fit max-w-[75%] bg-accent text-accent-foreground rounded-xl flex items-center gap-1"
    >
      <span
        v-for="n in 3"
        :key="n"
        class="block aspect-square w-2 rounded-full animate-bounce bg-black/50"
        :style="`animation-delay: calc(250ms * ${n})`"
      />
    </div>

    <div
      ref="scrollTrigger"
      class="h-0 -mt-2"
    />
  </div>
</template>
