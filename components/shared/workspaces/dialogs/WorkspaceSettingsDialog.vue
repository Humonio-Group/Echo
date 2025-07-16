<script setup lang="ts">
import { LoaderCircle, Save } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import OptionalStatus from "~/components/shared/statuses/OptionalStatus.vue";

function resetFormValues() {
  resetForm({
    values: {
      name: workspace.value?.name ?? "",
      description: workspace.value?.description ?? undefined,
      companyInfo: workspace.value?.companyInfo ?? "",
      productOrService: workspace.value?.productOrService ?? "",
      values: workspace.value?.values ?? "",
    },
  });
}

const open = ref<boolean>(false);
watch(open, () => resetFormValues());

const store = useWorkspaceStore();
const { workspace, loading } = storeToRefs(store);

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    companyInfo: z.string(),
    productOrService: z.string(),
    values: z.string(),
  })),
  initialValues: {
    name: workspace.value?.name ?? "",
    description: workspace.value?.description ?? undefined,
    companyInfo: workspace.value?.companyInfo ?? "",
    productOrService: workspace.value?.productOrService ?? "",
    values: workspace.value?.values ?? "",
  },
});
const submit = handleSubmit(async (values) => {
  open.value = !await store.saveWorkspaceInfo({
    ...values,
    description: values.description ?? null,
  });
  if (open.value) resetFormValues();
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="max-h-[90dvh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{{ $t("dialogs.workspaces.settings.title") }}</DialogTitle>
        <DialogDescription>{{ $t("dialogs.workspaces.settings.caption") }}</DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto">
        <form
          class="flex flex-col gap-4"
          @submit="submit"
        >
          <FormField
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.name") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Input
                  :placeholder="`ex. ${$t('brand.name')}`"
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="description"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.description") }} <OptionalStatus /></FormLabel>
              <FormControl v-bind="componentField">
                <Textarea
                  class="min-h-32"
                  :placeholder="`ex. ${$t('welcome-on', { brand: $t('brand.name') })}`"
                  :disabled="loading.savingWorkspace"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="companyInfo"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.company-info") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Textarea
                  class="min-h-32"
                  :placeholder="`ex. ${$t('welcome-on', { brand: $t('brand.name') })}`"
                  :disabled="loading.savingWorkspace"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="productOrService"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.product-or-service") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Textarea
                  class="min-h-32"
                  :placeholder="`ex. ${$t('welcome-on', { brand: $t('brand.name') })}`"
                  :disabled="loading.savingWorkspace"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="values"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.values") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Textarea
                  class="min-h-32"
                  :placeholder="`ex. ${$t('welcome-on', { brand: $t('brand.name') })}`"
                  :disabled="loading.savingWorkspace"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <DialogFooter>
            <DialogClose as-child>
              <Button
                type="button"
                variant="secondary"
                :disabled="loading.savingWorkspace"
              >
                {{ $t("btn.cancel") }}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              :disabled="loading.savingWorkspace"
            >
              <LoaderCircle
                v-if="loading.savingWorkspace"
                class="animate-spin"
              />
              <Save v-else />
              {{ $t("btn.save") }}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>
