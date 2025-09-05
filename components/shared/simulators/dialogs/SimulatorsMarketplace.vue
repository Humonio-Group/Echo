<script setup lang="ts">
import PublicSimulatorCard from "~/components/shared/simulators/cards/PublicSimulatorCard.vue";

const open = defineModel<boolean>("open");
watch(open, (val) => {
  if (!val) return;
  store.loadLibrary();
});

const store = useSimulatorStore();
const { library } = storeToRefs(store);
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t("dialogs.workspaces.library-dialog.title") }}</DialogTitle>
        <DialogDescription>{{ $t("dialogs.workspaces.library-dialog.caption") }}</DialogDescription>
      </DialogHeader>

      <div class="grid gap-2">
        <header class="flex items-center gap-1">
          <Input
            disabled
            placeholder="Search..."
          />
        </header>

        <div class="grid gap-2">
          <template v-if="library?.length">
            <PublicSimulatorCard
              v-for="sim in library"
              :key="sim.id"
              :simulator="sim"
              @duplicated="() => open = false"
            />
          </template>
          <div
            v-else
            class="grid place-items-center pt-10 pb-4"
          >
            <p class="text-sm text-muted-foreground italic">
              {{ $t("dialogs.workspaces.library-dialog.empty") }}
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
