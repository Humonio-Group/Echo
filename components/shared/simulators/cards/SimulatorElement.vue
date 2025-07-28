<script setup lang="ts">
import type { ISimulator } from "~/types/simulators";
import { CopyPlus, Edit, LoaderCircle, MoreHorizontal, Trash } from "lucide-vue-next";
import CreateSimulatorDialog from "~/components/shared/simulators/dialogs/CreateSimulatorDialog.vue";
import ConfirmDialog from "~/components/shared/dialogs/ConfirmDialog.vue";

const props = defineProps<{
  simulator: ISimulator;
  duplicable?: boolean;
  editable?: boolean;
}>();
const emit = defineEmits<{
  duplicated: [];
}>();

const store = useWorkspaceStore();
const { loading } = storeToRefs(store);

const isLoading = computed(() => loading.value.duplicatingSimulator.includes(props.simulator.id));
const editDialogOpen = ref<boolean>(false);
const confirmDeleteDialogOpen = ref<boolean>(false);

async function duplicate() {
  await store.duplicateSimulator(props.simulator.id);
  emit("duplicated");
}
async function destroy() {
  await store.deleteSimulator(props.simulator.id);
}
</script>

<template>
  <Card>
    <CardContent class="flex flex-row items-center gap-3">
      <Avatar class="size-10 rounded-md">
        <AvatarImage
          v-if="simulator.picture"
          :src="simulator.picture"
        />
        <AvatarFallback>{{ simulator.title.substring(0, 2) }}</AvatarFallback>
      </Avatar>

      <div class="grid flex-1 mr-3">
        <p class="font-semibold truncate">
          {{ simulator.title }}
        </p>
        <span class="text-sm text-muted-foreground truncate">{{ simulator.description }}</span>
      </div>

      <Button
        v-if="duplicable"
        size="icon"
        variant="ghost"
        :disabled="isLoading"
        @click="duplicate"
      >
        <LoaderCircle
          v-if="isLoading"
          class="animate-spin"
        />
        <CopyPlus v-else />
      </Button>
      <DropdownMenu v-if="editable">
        <DropdownMenuTrigger as-child>
          <Button
            size="icon"
            variant="ghost"
          >
            <MoreHorizontal />
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
    </CardContent>

    <CreateSimulatorDialog
      v-model:open="editDialogOpen"
      :simulator="simulator"
    />
    <ConfirmDialog
      v-model:open="confirmDeleteDialogOpen"
      @confirmed="destroy"
    />
  </Card>
</template>
