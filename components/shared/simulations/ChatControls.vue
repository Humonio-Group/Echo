<script setup lang="ts">
import { Send } from "lucide-vue-next";

const message = ref<string | undefined>();

const store = useRoomStore();
const { writing } = storeToRefs(store);

async function send() {
  if (!message.value?.trim().length) return;
  store.sendMessage(message.value).then();
  message.value = undefined;
}
</script>

<template>
  <div class="flex items-center gap-2 p-4">
    <Input
      v-model="message"
      placeholder="Message..."
      :disabled="writing"
      @keydown="(event: KeyboardEvent) => {
        if (event.key !== 'Enter') return;
        send();
      }"
    />

    <Button
      size="icon"
      :disabled="writing"
      @click="send"
    >
      <Send />
    </Button>
  </div>
</template>
