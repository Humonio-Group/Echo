<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import CreateSimulatorDialog from "~/components/shared/simulators/dialogs/CreateSimulatorDialog.vue";
import SimulatorElement from "~/components/shared/simulators/cards/SimulatorElement.vue";

const store = useSimulatorStore();
const { library } = storeToRefs(store);
const wsStore = useWorkspaceStore();

const selectedTab = ref<string>("private");
watch(selectedTab, (val) => {
  if (val !== "public") return;
  store.loadLibrary();
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="!max-w-2xl">
      <DialogHeader>
        <DialogTitle>{{ $t("dialogs.workspaces.library-dialog.title") }}</DialogTitle>
        <DialogDescription>{{ $t("dialogs.workspaces.library-dialog.caption") }}</DialogDescription>
      </DialogHeader>

      <Tabs
        v-model="selectedTab"
        class="flex-1 overflow-hidden"
      >
        <TabsList class="w-full">
          <TabsTrigger value="private">
            {{ $t("dialogs.workspaces.library-dialog.tabs.your-simulators") }}
          </TabsTrigger>
          <TabsTrigger value="public">
            {{ $t("dialogs.workspaces.library-dialog.tabs.public-simulators") }}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="private"
          class="grid gap-2"
        >
          <header class="flex items-center gap-1">
            <Input
              placeholder="Search..."
              disabled
            />
            <CreateSimulatorDialog>
              <Button>
                <Plus />
                {{ $t("btn.new") }}
              </Button>
            </CreateSimulatorDialog>
          </header>

          <div class="grid gap-2">
            <template v-if="wsStore.simulators.length">
              <SimulatorElement
                v-for="sim in wsStore.simulators"
                :key="sim.id"
                :simulator="sim"
                editable
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
        </TabsContent>
        <TabsContent
          value="public"
          class="grid gap-2"
        >
          <header class="flex items-center gap-1">
            <Input
              disabled
              placeholder="Search..."
            />
          </header>

          <div class="grid gap-2">
            <template v-if="library?.length">
              <SimulatorElement
                v-for="sim in library"
                :key="sim.id"
                :simulator="sim"
                duplicable
                @duplicated="selectedTab = 'private'"
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
        </tabscontent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
