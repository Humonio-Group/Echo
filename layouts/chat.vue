<script setup lang="ts">
import { ChevronLeft, LoaderCircle, MessageSquare, MessagesSquare, Square } from "lucide-vue-next";

const store = useRoomStore();
const { conversation } = storeToRefs(store);

const stopRequested = ref<boolean>(false);

provide<Ref<boolean, boolean>>("stopRequested", stopRequested);

const route = computed(() => useRoute());
const resultButton = computed(() => route.value.meta.resultButton);
const room = computed(() => route.value.params.simId);
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
        <Button
          v-if="!store.isStopped"
          variant="ghost"
          :disabled="stopRequested"
          @click="stopRequested = true"
        >
          <LoaderCircle
            v-if="stopRequested"
            class="animate-spin"
          />
          <Square v-else />
          {{ $t("btn.stop") }}
        </Button>
        <Button
          v-else-if="store.isStopped && store.hasResult && resultButton"
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
