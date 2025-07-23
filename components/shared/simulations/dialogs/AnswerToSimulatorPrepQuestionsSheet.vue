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
  <Sheet
    :open="!!selectedSimulator"
    @update:open="selectedSimulator = $event ? selectedSimulator : null"
  >
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{{ $t("dialogs.conversations.answer-questions.title") }}</SheetTitle>
        <SheetDescription>{{ $t("dialogs.conversations.answer-questions.caption") }}</SheetDescription>
      </SheetHeader>

      <div class="px-4 flex flex-col flex-1 gap-4">
        <div class="flex flex-col gap-4 flex-1 overflow-y-auto">
          <div
            v-for="question in questions"
            :key="question.key"
            class="flex flex-col gap-2"
          >
            <Label :for="question.key">{{ question.label }}</Label>
            <Input
              :id="question.key"
              v-model="fields[question.key]"
            />
          </div>
        </div>

        <SheetFooter>
          <SheetClose as-child>
            <Button variant="secondary">
              {{ $t("btn.cancel") }}
            </Button>
          </SheetClose>
          <Button
            :disabled="!canSubmit"
            @click="submit"
          >
            {{ $t("btn.add.default") }}
          </Button>
        </SheetFooter>
      </div>
    </SheetContent>
  </Sheet>
</template>
