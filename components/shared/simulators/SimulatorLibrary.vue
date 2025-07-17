<script setup lang="ts">
import SimulatorCard from "~/components/shared/simulators/SimulatorCard.vue";

const selectedTab = ref<string>("private");
watch(selectedTab, (val) => {
  if (val !== "public") return;
  store.loadLibrary();
});

const open = ref<boolean>(false);

const store = useSimulatorStore();
const { library } = storeToRefs(store);
const wsStore = useWorkspaceStore();
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="md:!max-w-2xl max-h-[75dvh] flex flex-col">
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
          class="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] auto-rows-min gap-4 overflow-y-auto"
        >
          <SimulatorCard
            v-for="sim in wsStore.simulators"
            :key="sim.id"
            :simulator="sim"
          />
        </TabsContent>
        <TabsContent
          value="public"
          class="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] auto-rows-min gap-4 overflow-y-auto"
        >
          <SimulatorCard
            v-for="sim in library"
            :key="sim.id"
            :simulator="sim"
            duplicable
            @duplicated="selectedTab = 'private'"
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
