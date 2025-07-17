<script setup lang="ts">
import SimulatorCard from "~/components/shared/simulators/SimulatorCard.vue";

const selectedTab = ref<string>("private");

const open = ref<boolean>(false);
watch(open, (val) => {
  if (!val) return;
  store.loadLibrary();
});

const store = useSimulatorStore();
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="md:!max-w-2xl min-h-[75dvh] max-h-[95dvh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{{ $t("dialogs.workspaces.library-dialog.title") }}</DialogTitle>
        <DialogDescription>{{ $t("dialogs.workspaces.library-dialog.caption") }}</DialogDescription>
      </DialogHeader>

      <Tabs
        v-model="selectedTab"
        class="flex-1"
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
            v-for="sim in store.privateLibrary"
            :key="sim.id"
            :simulator="sim"
          />
        </TabsContent>
        <TabsContent
          value="public"
          class="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] auto-rows-min gap-4 overflow-y-auto"
        >
          <SimulatorCard
            v-for="sim in store.publicLibrary"
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
