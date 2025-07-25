<script setup lang="ts">
import ChatGroup from "~/components/shared/simulations/chat/ChatGroup.vue";
import ChatControls from "~/components/shared/simulations/chat/ChatControls.vue";
import { EventType } from "~/types/globals/websocket";

definePageMeta({
  layout: "chat",
  resultButton: true,
});

const route = useRoute();
const roomId = computed(() => route.params.simId as string);

const store = useRoomStore();
const { messages } = storeToRefs(store);

const room = useWebSocketRoom(roomId);

const { userId } = useAuth();

const stopRequested = inject("stopRequested") as Ref<boolean, boolean>;
watch(stopRequested, (val) => {
  if (!val) return;
  room.send({
    type: EventType.STOP_REQUEST,
    room: roomId.value,
    emittedAt: new Date(),
  });
});
</script>

<template>
  <main class="flex-1 flex flex-col overflow-hidden">
    <ChatGroup :messages="messages ?? []" />

    <ChatControls @send="room.sendMessage(userId as string, $event)" />
  </main>
</template>
