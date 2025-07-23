<script setup lang="ts">
import { Search } from "lucide-vue-next";
import SimulatorCard from "~/components/shared/simulators/SimulatorCard.vue";
import type { TNull } from "~/types/globals/utils";
import AnswerToSimulatorPrepQuestionsSheet
  from "~/components/shared/simulations/dialogs/AnswerToSimulatorPrepQuestionsSheet.vue";
import type { ISimulator } from "~/types/simulators";

const store = useWorkspaceStore();

const selectedSimulator = ref<TNull<ISimulator>>(null);
</script>

<template>
  <div>
    <Dialog>
      <DialogTrigger as-child>
        <slot />
      </DialogTrigger>

      <DialogContent class="max-h-[75dvh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{{ $t("dialogs.conversations.create-conversation.title") }}</DialogTitle>
          <DialogDescription>{{ $t("dialogs.conversations.create-conversation.caption") }}</DialogDescription>
        </DialogHeader>

        <section class="flex-1 overflow-y-auto relative flex flex-col gap-4">
          <header class="relative">
            <Input
              class="pl-8"
              :placeholder="$t('labels.search')"
              disabled
            />
            <Search class="absolute size-4 top-2.5 left-2.5 text-muted-foreground opacity-50" />
          </header>

          <main class="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] auto-rows-min gap-4">
            <SimulatorCard
              v-for="sim in store.simulators"
              :key="sim.id"
              :simulator="sim"
              class="cursor-pointer outline-0 outline-primary/25 hover:outline-4 transition-all duration-150"
              @click="selectedSimulator = sim"
            />
          </main>
        </section>
      </DialogContent>
    </Dialog>

    <AnswerToSimulatorPrepQuestionsSheet v-model:selected-simulator="selectedSimulator" />
  </div>
</template>
