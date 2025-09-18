<script setup lang="ts">
import type { TNull } from "~/types/globals/utils";
import type { ISimulator } from "~/types/simulators";

const selectedSimulator = defineModel<TNull<ISimulator>>("selectedSimulator");
const questions = computed(() => selectedSimulator.value?.prepQuestions ?? []);

const fields = ref<{ [p: string]: string | undefined }>({});
const canSubmit = computed(() => Object.values(fields.value).every(f => f?.trim().length));
watch(questions, (val) => {
  fields.value = {};

  if (!val.length) return;

  const questionKeys = val.map(pq => pq.key);
  questionKeys.forEach(q => fields.value[q] = undefined);
});

const store = useWorkspaceStore();

function submit() {
  if (!selectedSimulator.value) return;

  const body = Object.keys(fields.value).map(prepQuestionKey => ({
    prepQuestionKey,
    answer: fields.value[prepQuestionKey] as string,
  }));
  store.startConversation(selectedSimulator.value.id, body);
}
</script>

<template>
  <Dialog
    :open="!!selectedSimulator"
    @update:open="selectedSimulator = $event ? selectedSimulator : null"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Avatar class="rounded-md size-8 text-xs text-muted-foreground">
            <AvatarImage
              v-if="selectedSimulator?.picture"
              :src="selectedSimulator?.picture"
            />
            <AvatarFallback>{{ selectedSimulator?.title.substring(0, 2) }}</AvatarFallback>
          </Avatar>
          {{ selectedSimulator?.title }}
        </DialogTitle>
        <DialogDescription>{{ selectedSimulator?.description }}</DialogDescription>
      </DialogHeader>

      <Separator />

      <div class="flex flex-col flex-1 gap-4">
        <div class="flex flex-col gap-4 flex-1 overflow-y-auto">
          <div
            v-for="question in questions"
            :key="question.key"
            class="flex flex-col gap-2"
          >
            <Label :for="question.key">{{ question.label }}</Label>
            <Textarea
              :id="question.key"
              v-model="fields[question.key]"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
            >
              {{ $t("btn.cancel") }}
            </Button>
          </DialogClose>
          <Button
            :disabled="!canSubmit"
            @click="submit"
          >
            {{ $t("btn.start") }}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>
