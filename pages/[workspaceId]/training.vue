<script setup lang="ts">
import { Settings2 } from "lucide-vue-next";
import SimulatorLibrary from "~/components/shared/simulators/SimulatorLibrary.vue";
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

      <SimulatorLibrary>
        <Button variant="secondary">
          <Settings2 />
          {{ $t("training.btn.manage-library") }}
        </Button>
      </SimulatorLibrary>
    </header>

    <main class="grid auto-rows-min md:grid-cols-2 gap-4 md:gap-8">
      <section class="flex flex-col">
        <!-- TODO: if ongoing sessions list length > 0 -->
        <header class="pb-3 border-b">
          <h2 class="text-sm font-semibold text-muted-foreground">
            {{ $t("training.labels.sessions.ongoing") }}
          </h2>
        </header>

        <main class="flex flex-col gap-2 pt-3">
          <p class="text-muted-foreground italic">
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
          <p class="text-muted-foreground italic">
            {{ $t("training.labels.sessions.no-past") }}
          </p>
        </main>
      </section>
    </main>
  </main>
</template>
