<script setup lang="ts">
import ChatGroup from "~/components/shared/simulations/chat/ChatGroup.vue";
import ChatControls from "~/components/shared/simulations/chat/ChatControls.vue";

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

    <ChatControls @send="sendMessage(userId as string, $event)" />
  </main>
</template>
