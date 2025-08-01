<script setup lang="ts">
import type { ISimulator, ISimulatorCreate, ISimulatorUpdate } from "~/types/simulators";
import { LoaderCircle, Plus, Trash } from "lucide-vue-next";
import { useFieldArray, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { assessmentTypes } from "~/types/conversations";
import type { EAssessmentType } from "~/types/conversations";

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
    duration: z.number().min(1).max(60),
    behaviorPrompt: z.string().min(1),
    prepQuestions: z.array(z.object({
      key: z.string().optional(),
      label: z.string().min(1),
    })).optional(),
    evaluations: z.array(z.object({
      key: z.string().optional(),
      type: z.enum(assessmentTypes),
      // assessmentPrompt: z.string().optional(),
      frameworkPrompt: z.string().optional(),
      criteria: z.array(z.string()).min(1).optional(),
      feedbackPrompt: z.string().optional(),
    })).optional(),
  })),
  initialValues: {
    title: props.simulator?.title,
    description: props.simulator?.description,
    duration: props.simulator?.duration ?? 10,
    behaviorPrompt: props.simulator?.behaviorPrompt,
    prepQuestions: props.simulator?.prepQuestions?.map(pq => ({
      key: pq.key,
      label: pq.label,
    })),
    evaluations: props.simulator?.evaluations?.map(ev => ({
      key: ev.key,
      type: ev.type,
      frameworkPrompt: ev.frameworkPrompt,
      criteria: ev.assessmentPrompt?.split("||"),
      feedbackPrompt: ev.feedbackPrompt,
    })),
  },
});

const { fields: prepQuestions, remove: removeQuestion, push: pushQuestion } = useFieldArray("prepQuestions");
const { fields: evaluations, remove: removeEvaluation, push: pushEvaluation } = useFieldArray("evaluations");

const store = useWorkspaceStore();
const { loading } = storeToRefs(store);

const submit = form.handleSubmit(async (values) => {
  if (editMode.value) await save({
    ...values,
    picture: null,
    prepQuestions: values.prepQuestions ?? [],
    evaluations: values.evaluations?.map(e => ({
      key: e.key,
      type: e.type,
      frameworkPrompt: e.frameworkPrompt || "",
      assessmentPrompt: e.criteria?.join("||") || "",
      feedbackPrompt: e.feedbackPrompt || "",
      maxValue: 10,
    })) ?? [],
  });
  else await create({
    ...values,
    picture: null,
    prepQuestions: values.prepQuestions ?? [],
    evaluations: values.evaluations?.map(e => ({
      type: e.type,
      frameworkPrompt: e.frameworkPrompt ?? "",
      assessmentPrompt: e.criteria?.join("||") ?? "",
      feedbackPrompt: e.feedbackPrompt ?? "",
      maxValue: 10,
    })) ?? [],
  });

  open.value = false;
});

async function create(values: ISimulatorCreate) {
  await store.createSimulator(values);
}
async function save(values: ISimulatorUpdate) {
  if (!props.simulator) return;

  const finalQuestions = values.prepQuestions?.map(q => q.key) ?? [];
  const finalEvaluations = values.evaluations?.map(e => e.key) ?? [];

  const questionsToDelete = props.simulator.prepQuestions?.map(q => q.key).filter(q => !finalQuestions.includes(q));
  const evaluationsToDelete = props.simulator.evaluations?.map(e => e.key).filter(e => !finalEvaluations.includes(e));

  await store.saveSimulator(props.simulator.id, {
    ...values,
    questionsToDelete,
    evaluationsToDelete,
  });
}
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
              <Input
                placeholder="ex. Humonio Simulator"
                :disabled="loading.creatingSimulator"
              />
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
              <Textarea
                class="min-h-32"
                :disabled="loading.creatingSimulator"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ value }"
          name="duration"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.duration") }}</FormLabel>
            <NumberField
              :min="1"
              :max="60"
              :model-value="value"
              @update:model-value="v => form.setFieldValue('duration', v ? v : undefined)"
            >
              <NumberFieldDecrement />
              <FormControl>
                <NumberFieldInput />
              </FormControl>
              <NumberFieldIncrement />
            </NumberField>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="behaviorPrompt"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.behavior-prompt") }}</FormLabel>
            <FormControl v-bind="componentField">
              <Textarea
                class="min-h-32"
                :disabled="loading.creatingSimulator"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <Separator />
        <div class="grid gap-4">
          <template
            v-for="(evaluation, index) in evaluations"
            :key="evaluation.key"
          >
            <FormField
              v-slot="{ value }"
              :name="`evaluations.${index}`"
            >
              <FormItem>
                <div class="flex items-center justify-between gap-4">
                  <FormLabel>{{ $t("labels.fields.evaluation-x", { value: index + 1 }) }}</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    :disabled="loading.creatingSimulator"
                    @click.prevent="removeEvaluation(index)"
                  >
                    <Trash />
                  </Button>
                </div>
                <div class="grid gap-4 px-2">
                  <FormField
                    v-slot="{ componentField }"
                    :name="`evaluations.${index}.type`"
                  >
                    <FormItem>
                      <FormLabel>{{ $t("labels.fields.assessment-type") }}</FormLabel>
                      <FormControl v-bind="componentField">
                        <Select>
                          <SelectTrigger class="w-full">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem
                              v-for="type in assessmentTypes"
                              :key="type"
                              :value="type"
                            >
                              {{ $t(`labels.enums.assessment-type.${type}`) }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField
                    v-slot="{ componentField }"
                    :name="`evaluations.${index}.frameworkPrompt`"
                  >
                    <FormItem>
                      <FormLabel>{{ $t("labels.fields.framework-prompt") }}</FormLabel>
                      <FormControl v-bind="componentField">
                        <Textarea
                          class="min-h-32"
                          :disabled="loading.creatingSimulator"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField
                    v-if="value['type'] === 'text'"
                    v-slot="{ componentField }"
                    :name="`evaluations.${index}.feedbackPrompt`"
                  >
                    <FormItem>
                      <FormLabel>{{ $t("labels.fields.feedback-prompt") }}</FormLabel>
                      <FormControl v-bind="componentField">
                        <Textarea
                          class="min-h-32"
                          :disabled="loading.creatingSimulator"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div
                    v-else
                    class="flex flex-col gap-2"
                  >
                    <div class="flex items-center justify-between">
                      <Label>{{ $t("labels.fields.evaluation-criteria") }}</Label>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        @click="() => {
                          if (!value.criteria) value.criteria = [];
                          value.criteria.push('');
                        }"
                      >
                        <Plus />
                      </Button>
                    </div>
                    <FormField
                      v-for="(criteria, i) in value.criteria"
                      :key="`${index}-${i}`"
                      v-slot="{ componentField }"
                      :name="`evaluations.${index}.criteria.${i}`"
                    >
                      <FormItem class="flex gap-2 items-center">
                        <FormControl v-bind="componentField">
                          <Input placeholder="ex: Empathie" />
                        </FormControl>
                        <Button
                          v-if="value.criteria.length > 1"
                          type="button"
                          size="icon"
                          variant="outline"
                          @click="value.criteria.splice(i, 1)"
                        >
                          <Trash />
                        </Button>
                      </FormItem>
                    </FormField>
                  </div>
                </div>
              </FormItem>
            </FormField>
            <Separator />
          </template>
          <Button
            type="button"
            :disabled="loading.creatingSimulator"
            @click.prevent="pushEvaluation({
              type: 'text',
              criteria: [''],
            })"
          >
            <Plus />
            {{ $t("btn.add.evaluation") }}
          </Button>
        </div>

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
                  :disabled="loading.creatingSimulator"
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
                    <Input :disabled="loading.creatingSimulator" />
                  </FormControl>
                </FormItem>
              </FormField>
            </FormItem>
          </FormField>
          <Button
            type="button"
            :disabled="loading.creatingSimulator"
            @click.prevent="pushQuestion"
          >
            <Plus />
            {{ $t("btn.add.prep-question") }}
          </Button>
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
              :disabled="loading.creatingSimulator"
            >
              {{ $t("btn.cancel") }}
            </Button>
          </DialogClose>

          <Button :disabled="loading.creatingSimulator">
            <LoaderCircle
              v-if="loading.creatingSimulator"
              class="animate-spin"
            />
            {{ $t(`btn.${editMode ? "save" : "add.default"}`) }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
