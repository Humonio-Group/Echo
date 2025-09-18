<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import type { IConversation } from "~/types/conversations";

const { locale } = useI18n();

const props = defineProps<{
  conversation: IConversation;
}>();

const df = new Intl.DateTimeFormat(locale.value, {
  dateStyle: "long",
});
const tf = new Intl.DateTimeFormat(locale.value, {
  timeStyle: "short",
});

const lastMessage = computed(() => {
  const messages = props.conversation.messages ?? [];
  return !messages.length ? null : messages[messages.length - 1];
});
const start = computed(() => ({
  date: df.format(new Date(props.conversation.startedAt)),
  time: tf.format(new Date(props.conversation.startedAt)),
}));
const end = computed(() => ({
  date: df.format(new Date(props.conversation.stoppedAt)),
  time: tf.format(new Date(props.conversation.stoppedAt)),
}));

const isStopped = computed(() => new Date(props.conversation.stoppedAt).getTime() <= Date.now());

const hasResults = computed(() => !!props.conversation.assessments?.length);

const link = computed(() => {
  const base = `/simulations/${props.conversation.uid}`;

  if (new Date(props.conversation.stoppedAt).getTime() > Date.now()) return `${base}/chat`;
  if (hasResults.value) return `${base}/results`;
  return undefined;
});
const dates = computed(() => {
  const { startedAt, stoppedAt } = props.conversation;
  const started = new Date(startedAt);
  const stopped = new Date(stoppedAt);

  const sameDay = started.getDate() === stopped.getDate() && started.getMonth() === stopped.getMonth() && started.getFullYear() === stopped.getFullYear();

  return {
    started: `${df.format(started)} ${tf.format(started)}`,
    stopped: `${sameDay ? "" : `${df.format(stopped)}`} ${tf.format(stopped)}`,
  };
});
</script>

<template>
  <Card class="relative select-none overflow-hidden">
    <CardContent class="flex gap-4">
      <Avatar class="rounded-md shadow-sm size-12">
        <AvatarFallback>{{ conversation.name.substring(0, 2) }}</AvatarFallback>
      </Avatar>

      <div class="relative flex flex-col flex-1 overflow-hidden">
        <p class="font-semibold">
          {{ conversation.name }}
        </p>
        <span
          v-if="lastMessage"
          class="truncate text-sm text-muted-foreground"
        >{{ lastMessage.content }}</span>
        <Badge
          v-if="!hasResults && isStopped"
          variant="secondary"
          class="absolute top-0 right-0"
        >
          {{ $t("labels.empty.results") }}
        </Badge>

        <div class="flex items-center gap-2 font-medium text-sm mt-2 self-end">
          {{ dates.started }}
          <ArrowRight class="size-3" />
          {{ dates.stopped.trim() }}
        </div>
      </div>
    </CardContent>

    <NuxtLinkLocale
      v-if="link"
      :to="useWorkspacePath(link)"
      class="absolute inset-0"
    />
  </Card>
</template>
