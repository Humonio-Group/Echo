<script setup lang="ts">
import ChatBubble from "~/components/shared/simulations/ChatBubble.vue";
import ChatGroup from "~/components/shared/simulations/ChatGroup.vue";
import ChatControls from "~/components/shared/simulations/ChatControls.vue";

definePageMeta({
  layout: "chat",
});

const store = useRoomStore();
const { messages } = storeToRefs(store);

onNuxtReady(() => {
  store.connect();
});
</script>

<template>
  <main class="flex-1 flex flex-col overflow-hidden">
    <ChatGroup :messages="messages ?? []">
      <ChatBubble sender-name="ia">
        Bonjour Loïc
      </ChatBubble>
      <ChatBubble
        sender-name="Loïc MAES"
        inverted
      >
        Bonjour IA
      </ChatBubble>
      <ChatBubble sender-name="ia">
        On va donc commencer notre entretien. C'est partit !
      </ChatBubble>
    </ChatGroup>

    <ChatControls />
  </main>
</template>
