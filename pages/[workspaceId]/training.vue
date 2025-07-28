<script setup lang="ts">
import { LoaderCircle, Settings2 } from "lucide-vue-next";
import SimulationCard from "~/components/shared/simulations/SimulationCard.vue";
import SimulatorsLibraryDialog from "~/components/shared/simulators/dialogs/SimulatorsLibraryDialog.vue";

const store = useConversationStore();
const { loading } = storeToRefs(store);

store.loadConversations();
</script>

<template>
  <main
    data-page="workspace.home"
    class="grid auto-rows-min gap-4"
  >
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        {{ $t("training.title") }}
      </h1>

      <SimulatorsLibraryDialog>
        <Button variant="secondary">
          <Settings2 />
          {{ $t("training.btn.manage-library") }}
        </Button>
      </SimulatorsLibraryDialog>
    </header>

    <main class="grid auto-rows-min md:grid-cols-2 gap-4 md:gap-8">
      <section class="flex flex-col">
        <header class="pb-3 border-b">
          <h2 class="text-sm font-semibold text-muted-foreground">
            {{ $t("training.labels.sessions.ongoing") }}
          </h2>
        </header>

        <main class="flex flex-col gap-2 pt-3">
          <SimulationCard
            v-for="conv in store.ongoingConversations"
            :key="conv.uid"
            :conversation="conv"
          />

          <div
            v-if="loading"
            class="grid place-items-center py-8"
          >
            <LoaderCircle class="animate-spin" />
          </div>
          <p
            v-else-if="!store.ongoingConversations.length"
            class="text-muted-foreground italic"
          >
            {{ $t("training.labels.sessions.no-ongoing") }}
          </p>
        </main>
      </section>

      <section class="flex flex-col">
        <header class="pb-3 border-b">
          <h2 class="text-sm font-semibold text-muted-foreground">
            {{ $t("training.labels.sessions.past") }}
          </h2>
        </header>

        <main class="flex flex-col gap-2 pt-3">
          <SimulationCard
            v-for="conv in store.pastConversations"
            :key="conv.uid"
            :conversation="conv"
          />

          <div
            v-if="loading"
            class="grid place-items-center py-8"
          >
            <LoaderCircle class="animate-spin" />
          </div>
          <p
            v-else-if="!store.pastConversations.length"
            class="text-muted-foreground italic"
          >
            {{ $t("training.labels.sessions.no-past") }}
          </p>
        </main>
      </section>
    </main>
  </main>
</template>
