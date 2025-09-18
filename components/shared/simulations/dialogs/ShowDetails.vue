<script setup lang="ts">
import type { IConversation } from "~/types/conversations";
import type { ISimulator } from "~/types/simulators";

const props = defineProps<{
  conversation: IConversation;
}>();

const simulator = computed(() => props.conversation.simulator as ISimulator);
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Avatar class="size-8 rounded-md text-muted-foreground text-xs">
            <AvatarImage
              v-if="simulator.picture"
              :src="simulator.picture"
            />
            <AvatarFallback>{{ simulator.title.substring(0, 2) }}</AvatarFallback>
          </Avatar>
          {{ simulator.title }}
        </DialogTitle>
        <DialogDescription>{{ simulator.description }}</DialogDescription>
      </DialogHeader>

      <Separator />

      <div class="flex flex-col gap-4">
        <div
          v-for="answer in conversation.answers"
          :key="answer.id"
          class="flex flex-col gap-2"
        >
          <p class="text-sm font-medium text-muted-foreground">
            {{ answer.prepQuestion?.label }}
          </p>
          <Textarea
            :model-value="answer.answer"
            disabled
          />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
