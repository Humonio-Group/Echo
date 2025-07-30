<script setup lang="ts">
import { ChartArea, Gauge, LayoutDashboard, Plus, Users } from "lucide-vue-next";
import CreateSimulationDialog from "~/components/shared/simulations/dialogs/CreateSimulationDialog.vue";
</script>

<template>
  <div class="h-16 rounded-full bg-background border px-6 flex items-center justify-between sm:gap-8 sm:w-min sm:mx-auto">
    <Button
      size="icon"
      variant="ghost"
      class="text-muted-foreground"
      disabled
    >
      <!-- <NuxtLinkLocale
        :to="useWorkspacePath('/')"
        active-class="!text-foreground"
      >
        <LayoutDashboard class="size-5" />
      </NuxtLinkLocale> -->
      <LayoutDashboard class="size-5" />
    </Button>
    <Button
      size="icon"
      variant="ghost"
      class="text-muted-foreground"
      as-child
    >
      <NuxtLinkLocale
        :to="useWorkspacePath('/training')"
        active-class="!text-foreground"
      >
        <Gauge class="size-5" />
      </NuxtLinkLocale>
    </Button>

    <CreateSimulationDialog>
      <Button
        size="icon"
        class="rounded-full scale-175 -translate-y-3"
      >
        <Plus />
      </Button>
    </CreateSimulationDialog>

    <Button
      size="icon"
      variant="ghost"
      class="text-muted-foreground"
      disabled
    >
      <!-- <NuxtLinkLocale
        :to="useWorkspacePath('/performance')"
        active-class="!text-foreground"
      >
        <ChartArea class="size-5" />
      </NuxtLinkLocale> -->
      <ChartArea class="size-5" />
    </Button>
    <Button
      size="icon"
      variant="ghost"
      class="text-muted-foreground"
      as-child
    >
      <NuxtLinkLocale
        :to="useWorkspacePath('/team')"
        active-class="!text-foreground"
      >
        <Users class="size-5" />
      </NuxtLinkLocale>
    </Button>
  </div>
</template>
