<script setup lang="ts">
import { LoaderCircle, Rocket } from "lucide-vue-next";
import SimulationCard from "~/components/shared/simulations/SimulationCard.vue";
import CreateSimulationDialog from "~/components/shared/simulations/dialogs/CreateSimulationDialog.vue";

const { t } = useI18n();

const { workspace } = storeToRefs(useWorkspaceStore());

useHead({
  title: t("brand.seo.workspace.training", { workspace: workspace.value?.name }),
});

const store = useConversationStore();
const { loading } = storeToRefs(store);

store.loadConversations();
</script>

<template>
  <main
    data-page="workspace.home"
    class="grid auto-rows-min gap-8 mx-auto w-full max-w-5xl pt-4 pb-6"
  >
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        {{ $t("training.title") }}
      </h1>

      <CreateSimulationDialog>
        <Button>
          {{ $t("btn.new-simulation") }}
          <Rocket />
        </Button>
      </CreateSimulationDialog>
    </header>

    <section class="grid auto-rows-min gap-4">
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
    </section>
    <Separator />
    <section class="grid auto-rows-min gap-4">
      <h2 class="text-sm font-semibold text-muted-foreground">
        {{ $t("training.labels.sessions.past") }}
      </h2>

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
    </section>
  </main>
</template>
