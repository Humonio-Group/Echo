<script setup lang="ts">
import type { ISimulator } from "~/types/simulators";
import { Plus, Trash } from "lucide-vue-next";
import { useFieldArray, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const open = defineModel<boolean>("open");
watch(open, (val) => {
  if (!val) return;
  form.resetForm();
});

const props = defineProps<{
  simulator?: ISimulator;
}>();
const editMode = computed(() => !!props.simulator);

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    title: z.string().min(1),
    description: z.string(),
    behaviorPrompt: z.string().min(1),
    prepQuestions: z.array(z.object({
      prepQuestionKey: z.string().optional(),
      label: z.string().min(1),
    })).optional(),
    evaluations: z.array(z.object({
      evaluationKey: z.string().optional(),
      frameworkPrompt: z.string().optional(),
      assessmentPrompt: z.string().optional(),
      feedbackPrompt: z.string().optional(),
    })).optional(),
  })),
  initialValues: {
    title: props.simulator?.title,
    description: props.simulator?.description,
    behaviorPrompt: props.simulator?.behaviorPrompt,
    prepQuestions: props.simulator?.prepQuestions?.map(pq => ({
      prepQuestionKey: pq.key,
      label: pq.label,
    })),
    evaluations: props.simulator?.evaluations?.map(ev => ({
      evaluationKey: ev.key,
      frameworkPrompt: ev.frameworkPrompt,
      assessmentPrompt: ev.assessmentPrompt,
      feedbackPrompt: ev.feedbackPrompt,
    })),
  },
});

const { fields: prepQuestions, remove: removeQuestion, push: pushQuestion } = useFieldArray("prepQuestions");
const { fields: evaluations, remove: removeEvaluation, push: pushEvaluation } = useFieldArray("evaluations");

const submit = form.handleSubmit(async (values) => {
  console.table(values);

  if (editMode.value) await save();
  else await create();

  open.value = false;
});

async function create() {}
async function save() {}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="max-h-[90dvh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ $t("dialogs.simulators.create-simulator.title") }}</DialogTitle>
        <DialogDescription>{{ $t("dialogs.simulators.create-simulator.caption") }}</DialogDescription>
      </DialogHeader>

      <form
        class="grid gap-4"
        @submit="submit"
      >
        <FormField
          v-slot="{ componentField }"
          name="title"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.title") }}</FormLabel>
            <FormControl v-bind="componentField">
              <Input placeholder="ex. Humonio Simulator" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="description"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.description") }}</FormLabel>
            <FormControl v-bind="componentField">
              <Textarea class="min-h-32" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="behaviorPrompt"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.behavior-prompt") }}</FormLabel>
            <FormControl v-bind="componentField">
              <Textarea class="min-h-32" />
            </FormControl>
          </FormItem>
        </FormField>

        <Separator />
        <div class="grid gap-4">
          <FormField
            v-for="(prepQuestion, index) in prepQuestions"
            :key="prepQuestion.key"
            :name="`prepQuestions.${index}`"
          >
            <FormItem>
              <div class="flex items-center justify-between gap-4">
                <FormLabel>{{ $t("labels.fields.prep-question-x", { value: index + 1 }) }}</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  @click.prevent="removeQuestion(index)"
                >
                  <Trash />
                </Button>
              </div>
              <FormField
                v-slot="{ componentField }"
                :name="`prepQuestions.${index}.label`"
              >
                <FormItem>
                  <FormControl v-bind="componentField">
                    <Input />
                  </FormControl>
                </FormItem>
              </FormField>
            </FormItem>
          </FormField>
          <Button
            type="button"
            @click.prevent="pushQuestion"
          >
            <Plus />
            {{ $t("btn.add.prep-question") }}
          </Button>
        </div>

        <Separator />
        <div class="grid gap-4">
          <FormField
            v-for="(evaluation, index) in evaluations"
            :key="evaluation.key"
            :name="`evaluations.${index}`"
          >
            <FormItem>
              <div class="flex items-center justify-between gap-4">
                <FormLabel>{{ $t("labels.fields.evaluation-x", { value: index + 1 }) }}</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  @click.prevent="removeEvaluation(index)"
                >
                  <Trash />
                </Button>
              </div>
              <div class="grid gap-4 px-2">
                <FormField
                  v-slot="{ componentField }"
                  :name="`evaluations.${index}.frameworkPrompt`"
                >
                  <FormItem>
                    <FormLabel>{{ $t("labels.fields.framework-prompt") }}</FormLabel>
                    <FormControl v-bind="componentField">
                      <Textarea class="min-h-32" />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField
                  v-slot="{ componentField }"
                  :name="`evaluations.${index}.assessmentPrompt`"
                >
                  <FormItem>
                    <FormLabel>{{ $t("labels.fields.assessment-prompt") }}</FormLabel>
                    <FormControl v-bind="componentField">
                      <Textarea class="min-h-32" />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField
                  v-slot="{ componentField }"
                  :name="`evaluations.${index}.feedbackPrompt`"
                >
                  <FormItem>
                    <FormLabel>{{ $t("labels.fields.feedback-prompt") }}</FormLabel>
                    <FormControl v-bind="componentField">
                      <Textarea class="min-h-32" />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
            </FormItem>
          </FormField>
          <Button
            type="button"
            @click.prevent="pushEvaluation"
          >
            <Plus />
            {{ $t("btn.add.evaluation") }}
          </Button>
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

          <Button>
            {{ $t(`btn.${editMode ? "save" : "add.default"}`) }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
