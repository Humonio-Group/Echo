<script setup lang="ts">
import { ChevronLeft, MessagesSquare, Square } from "lucide-vue-next";

const store = useRoomStore();

const stopRequested = ref<boolean>(false);

provide<Ref<boolean, boolean>>("stopRequested", stopRequested);
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
          AI
        </p>
      </div>

      <div class="flex justify-end">
        <Button
          v-if="!store.isStopped"
          variant="ghost"
          @click="stopRequested = true"
        >
          <Square />
          {{ $t("btn.stop") }}
        </Button>
        <Button
          v-if="store.isStopped && store.hasResult"
          variant="ghost"
          disabled
        >
          <MessagesSquare />
          {{ $t("labels.feedback", 2) }}
        </Button>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>
