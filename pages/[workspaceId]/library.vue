<script setup lang="ts">
import { BookDashed, LibraryBig, Plus, Search } from "lucide-vue-next";
import LibraryTable from "~/components/shared/simulators/tables/LibraryTable.vue";
import SimulatorsMarketplace from "~/components/shared/simulators/dialogs/SimulatorsMarketplace.vue";
import CreateSimulatorDialog from "~/components/shared/simulators/dialogs/CreateSimulatorDialog.vue";

const scratchOpen = ref<boolean>(false);
const libraryOpen = ref<boolean>(false);
</script>

<template>
  <main
    data-page="workspace.library"
    class="flex flex-col gap-2"
  >
    <h1 class="text-2xl font-bold">
      {{ $t("library.title") }}
    </h1>

    <header class="flex items-center gap-2">
      <div class="relative flex-1">
        <Input
          :placeholder="$t('labels.search')"
          disabled
          class="pl-8"
        />
        <Search class="size-4 absolute top-2.5 left-2.5 text-muted-foreground opacity-50" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button>
            <Plus />
            {{ $t("btn.add.default") }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="scratchOpen = true">
            <BookDashed />
            {{ $t("btn.add.simulator.from-scratch") }}
          </DropdownMenuItem>
          <DropdownMenuItem @click="libraryOpen = true">
            <LibraryBig />
            {{ $t("btn.add.simulator.from-library") }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SimulatorsMarketplace v-model:open="libraryOpen" />
      <CreateSimulatorDialog v-model:open="scratchOpen" />
    </header>
    <LibraryTable />
  </main>
</template>
