<script setup lang="ts">
import ChatBubble from "~/components/shared/simulations/chat/ChatBubble.vue";
import type { IConversation } from "~/types/conversations";
import type { ISimulator } from "~/types/simulators";

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

const simulator = computed(() => props.conversation.simulator as ISimulator);

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
    <div class="flex flex-col items-center gap-4 py-16 mb-12">
      <Avatar class="size-20">
        <AvatarImage
          v-if="simulator.picture"
          :src="simulator.picture"
        />
        <AvatarFallback>{{ simulator.title.substring(0, 2) }}</AvatarFallback>
      </Avatar>

      <div class="flex flex-col gap-1 items-center max-w-[50ch] text-center">
        <h2 class="text-xl font-bold">
          {{ simulator.title }}
        </h2>
        <p class="text-muted-foreground leading-relaxed">
          {{ simulator.description }}
        </p>
      </div>
    </div>

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
