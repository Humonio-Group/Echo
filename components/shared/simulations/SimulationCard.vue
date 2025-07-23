<script setup lang="ts">
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

const hasResults = computed(() => props.conversation.assessments?.length);

const link = computed(() => {
  const base = `/simulations/${props.conversation.uid}`;

  if (new Date(props.conversation.stoppedAt).getTime() > Date.now()) return `${base}/chat`;
  if (hasResults.value) return `${base}/results`;
  return undefined;
});
</script>

<template>
  <Card class="relative select-none">
    <CardContent class="flex gap-4">
      <Avatar class="rounded-md shadow-sm">
        <AvatarFallback>{{ conversation.name.substring(0, 2) }}</AvatarFallback>
      </Avatar>

      <div class="relative grid">
        <p class="font-semibold">
          {{ conversation.name }}
        </p>
        <span
          v-if="lastMessage"
          class="truncate text-sm text-muted-foreground"
        >{{ lastMessage.content }}</span>
        <Badge
          variant="secondary"
          class="absolute top-0 right-0"
        >
          {{ $t("labels.empty.results") }}
        </Badge>
      </div>
    </CardContent>
    <Separator />
    <CardFooter class="grid grid-cols-2 divide-x">
      <div class="flex flex-col items-center">
        <span class="text-xs font-semibold text-muted-foreground">{{ $t("labels.start") }}</span>
        <div class="text-center leading-snug">
          <p>{{ start.date }}</p>
          <p class="text-sm">
            {{ start.time }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-xs font-semibold text-muted-foreground">{{ $t("labels.end") }}</span>
        <div class="text-center leading-snug">
          <p>{{ end.date }}</p>
          <p class="text-sm">
            {{ end.time }}
          </p>
        </div>
      </div>
    </CardFooter>

    <NuxtLinkLocale
      v-if="link"
      :to="useWorkspacePath(link)"
      class="absolute inset-0"
    />
  </Card>
</template>
