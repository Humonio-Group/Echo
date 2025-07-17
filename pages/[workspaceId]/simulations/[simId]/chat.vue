<script setup lang="ts">
import ChatBubble from "~/components/shared/simulations/ChatBubble.vue";
import ChatGroup from "~/components/shared/simulations/ChatGroup.vue";
import ChatControls from "~/components/shared/simulations/ChatControls.vue";

definePageMeta({
  layout: "chat",
});

const route = useRoute();
const roomId = computed(() => route.params.simId as string);

const store = useRoomStore();
const { messages } = storeToRefs(store);

const { sendMessage } = useWebSocketRoom(roomId);

const { userId } = useAuth();
</script>

<template>
  <main class="flex-1 flex flex-col overflow-hidden">
    <ChatGroup :messages="messages ?? []" />

    <ChatControls @send="sendMessage(userId, $event)" />
  </main>
</template>
