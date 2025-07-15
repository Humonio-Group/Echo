<script setup lang="ts">
import { LoaderCircle, Plus } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

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
              placeholder="ex. Humonio"
              :disabled="loading"
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
