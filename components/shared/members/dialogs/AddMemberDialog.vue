<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { roles } from "~/types/workspaces";

const open = defineModel<boolean>("open");
const store = useMembersStore();

watch(open, (val) => {
  if (!val) return;
  form.resetForm();
});

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    userId: z.string().min(6).refine(val => val.startsWith("user_")),
    role: z.enum(roles),
  })),
  initialValues: {
    role: "member",
  },
});
const submit = form.handleSubmit(async ({ userId, role }) => {
  await store.addMember(userId, role);
  open.value = false;
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t("dialogs.workspaces.add-member.title") }}</DialogTitle>
        <DialogDescription>{{ $t("dialogs.workspaces.add-member.caption") }}</DialogDescription>
      </DialogHeader>

      <form
        class="flex flex-col gap-4"
        @submit.prevent="submit"
      >
        <FormField
          v-slot="{ componentField }"
          name="userId"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.user-id") }}</FormLabel>
            <FormControl v-bind="componentField">
              <Input />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="role"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.role") }}</FormLabel>
            <FormControl v-bind="componentField">
              <Select>
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="role in roles"
                    :key="role"
                    :value="role"
                    :disabled="role === 'observer'"
                  >
                    {{ role }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>

        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
            >
              {{ $t("btn.cancel") }}
            </Button>
          </DialogClose>
          <Button type="submit">
            {{ $t("btn.add.default") }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
