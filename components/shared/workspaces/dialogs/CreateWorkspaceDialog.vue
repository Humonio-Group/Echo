<script setup lang="ts">
import { LoaderCircle, Plus } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import OptionalStatus from "~/components/shared/statuses/OptionalStatus.vue";

const open = ref<boolean>(false);
watch(open, () => resetForm());

const loading = ref<boolean>(false);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(z.object({
    name: z.string().min(1),
  })),
});
const submit = handleSubmit(async () => {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  loading.value = false;
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ $t("dialogs.workspaces.create-workspace.title") }}
        </DialogTitle>
        <DialogDescription>
          {{ $t("dialogs.workspaces.create-workspace.caption") }}
        </DialogDescription>
      </DialogHeader>

      <form
        class="flex flex-col gap-4"
        @submit="submit"
      >
        <FormField
          v-slot="{ componentField }"
          name="name"
        >
          <FormLabel>{{ $t("labels.fields.name") }}</FormLabel>
          <FormControl v-bind="componentField">
            <Input
              :placeholder="`ex. ${$t('brand.name')}`"
              :disabled="loading.creatingWorkspace"
            />
          </FormControl>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="description"
        >
          <FormLabel>{{ $t("labels.fields.description") }} <OptionalStatus /></FormLabel>
          <FormControl v-bind="componentField">
            <Textarea
              :placeholder="`ex. ${$t('welcome-on', { brand: $t('brand.name') })}`"
              class="min-h-32"
              :disabled="loading.creatingWorkspace"
            />
          </FormControl>
        </FormField>

        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
              :disabled="loading"
            >
              {{ $t("btn.cancel") }}
            </Button>
          </DialogClose>

          <Button
            type="submit"
            :disabled="loading"
          >
            <LoaderCircle
              v-if="loading"
              class="animate-spin"
            />
            <Plus v-else />
            {{ $t("btn.add.default") }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
