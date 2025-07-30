<script setup lang="ts">
import ChatGroup from "~/components/shared/simulations/chat/ChatGroup.vue";
import ChatControls from "~/components/shared/simulations/chat/ChatControls.vue";
import { EventType } from "~/types/globals/websocket";
import type { IConversation } from "~/types/conversations";

const { t } = useI18n();

definePageMeta({
  layout: "chat",
  resultButton: true,
});

const route = useRoute();
const roomId = computed(() => route.params.simId as string);

useHead({
  title: t("brand.seo.workspace.conversation.chat", { brand: useBrandName(), conv_id: roomId.value }),
});

const store = useRoomStore();
const { conversation, messages } = storeToRefs(store);
const conv = computed(() => conversation.value as IConversation);

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
    <ChatGroup
      :conversation="conv"
      :messages="messages ?? []"
    />

    <ChatControls
      v-if="!store.isStopped"
      @send="room.sendMessage(userId as string, $event)"
    />
  </main>
</template>
