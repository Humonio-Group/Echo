<script setup lang="ts">
import { Edit, MoreVertical, Trash } from "lucide-vue-next";
import CreateSimulatorDialog from "~/components/shared/simulators/dialogs/CreateSimulatorDialog.vue";
import ConfirmDialog from "~/components/shared/dialogs/ConfirmDialog.vue";
import type { ISimulator } from "~/types/simulators";

const props = defineProps<{
  simulator: ISimulator;
}>();

const store = useWorkspaceStore();

const editDialogOpen = ref<boolean>(false);
const confirmDeleteDialogOpen = ref<boolean>(false);

async function destroy() {
  await store.deleteSimulator(props.simulator.id);
}
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          size="icon"
          variant="ghost"
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem @click="editDialogOpen = true">
            <Edit />
            {{ $t("btn.edit") }}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            @click="confirmDeleteDialogOpen = true"
          >
            <Trash />
            {{ $t("btn.delete.default") }}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <CreateSimulatorDialog
      v-model:open="editDialogOpen"
      :simulator="simulator"
    />
    <ConfirmDialog
      v-model:open="confirmDeleteDialogOpen"
      @confirmed="destroy"
    />
  </div>
</template>
