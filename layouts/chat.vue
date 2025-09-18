<script setup lang="ts">
import { ChevronLeft, MessageSquare, MessagesSquare } from "lucide-vue-next";

const store = useRoomStore();
const { conversation } = storeToRefs(store);

const stopRequested = ref<boolean>(false);

provide<Ref<boolean, boolean>>("stopRequested", stopRequested);

const route = computed(() => useRoute());
const resultButton = computed(() => route.value.meta.resultButton);
const room = computed(() => route.value.params.simId);

const timeLeft = ref<string>("00:00");
let interval: null | NodeJS.Timeout = null;

watch(stopRequested, (value) => {
  if (!value) return;
  clearTimer();
});

const clearTimer = (stop: boolean = false) => {
  if (!interval) return;
  clearInterval(interval);
  interval = null;

  if (stop) stopRequested.value = true;
};

onMounted(() => {
  interval = setInterval(() => {
    const now = Date.now();
    const end = new Date(conversation.value?.stoppedAt ?? "").getTime();

    const diff = end - now;
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timeLeft.value = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    if (minutes <= 0 && seconds <= 0) clearTimer(true);
  }, 500);
});
onBeforeUnmount(() => {
  clearTimer();
});
</script>

<template>
  <div
    data-layout="chat"
    class="h-dvh flex flex-col overflow-hidden"
  >
    <header class="shrink-0 py-2 px-4 grid grid-cols-3 items-center border-b">
      <Button
        size="icon"
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale :to="useWorkspacePath('/training')">
          <ChevronLeft />
        </NuxtLinkLocale>
      </Button>

      <div class="flex flex-col items-center gap-1 flex-1">
        <Avatar class="size-10">
          <AvatarImage src="/images/ia-avatar.gif" />
        </Avatar>
        <p class="font-semibold text-muted-foreground">
          {{ conversation?.simulator?.title }}
        </p>
      </div>

      <div class="flex justify-end">
        <p
          v-if="!store.isStopped && !stopRequested"
          class="text-muted-foreground"
        >
          {{ timeLeft }}
        </p>

        <Button
          v-if="store.isStopped && store.hasResult && resultButton"
          variant="ghost"
          as-child
        >
          <NuxtLinkLocale :to="useWorkspacePath(`/simulations/${room}/results`)">
            <MessagesSquare />
            {{ $t("labels.feedback", 2) }}
          </NuxtLinkLocale>
        </Button>
        <Button
          v-else-if="store.isStopped && !resultButton"
          variant="ghost"
          as-child
        >
          <NuxtLinkLocale :to="useWorkspacePath(`/simulations/${room}/chat`)">
            <MessageSquare />
            {{ $t("btn.chat") }}
          </NuxtLinkLocale>
        </Button>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>
