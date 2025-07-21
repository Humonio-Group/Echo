<script setup lang="ts">
import { Send } from "lucide-vue-next";

const emit = defineEmits<{
  send: [string];
}>();

const message = ref<string | undefined>();
const input = ref<HTMLTextAreaElement>();

const store = useRoomStore();
const { writing } = storeToRefs(store);

const canSend = computed(() => !!message.value?.trim().length);

const autoResize = () => {
  const textarea = input.value;
  if (!textarea) return;

  textarea.style.height = "auto";

  const maxHeight = 128;
  const newHeight = Math.min(textarea.scrollHeight, maxHeight);

  textarea.style.height = `${newHeight}px`;
};

async function send() {
  const msg = message.value?.trim();
  if (!msg?.length) return;
  emit("send", msg);
  message.value = undefined;
  nextTick(autoResize);
}

const handleInput = () => nextTick(autoResize);
const handleKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    send();
    return;
  }
};
</script>

<template>
  <div class="relative flex items-center gap-2 p-4">
    <p
      v-if="writing"
      class="absolute left-6 top-0 -translate-y-1/2 text-xs italic font-semibold text-muted-foreground animate-pulse"
    >
      {{ $t("labels.thinking") }}
    </p>

    <Textarea
      ref="input"
      v-model="message"
      :placeholder="$t('labels.fields.message')"
      class="min-h-9 max-h-32 w-full resize-none overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
      :disabled="writing"
      rows="1"
      @input="handleInput"
      @keydown="handleKeydown"
    />
    <Button
      size="icon"
      :disabled="writing || !canSend"
      @click="send"
    >
      <Send />
    </Button>
  </div>
</template>
