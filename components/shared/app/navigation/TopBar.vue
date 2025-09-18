<script setup lang="ts">
import { Home, Plus, Settings } from "lucide-vue-next";
import WorkspaceSettingsDialog from "~/components/shared/workspaces/dialogs/WorkspaceSettingsDialog.vue";
import CreateSimulationDialog from "~/components/shared/simulations/dialogs/CreateSimulationDialog.vue";
import AppLogo from "~/components/shared/app/AppLogo.vue";
</script>

<template>
  <div class="flex items-center justify-between md:justify-start gap-4 md:gap-12">
    <NuxtLinkLocale to="/">
      <AppLogo class="h-8 w-auto" />
    </NuxtLinkLocale>

    <nav class="flex-1 items-center gap-1 hidden md:flex">
      <!-- <Button
        size="icon"
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          to="/"
          active-class="!bg-accent !text-accent-foreground"
        >
          <Home />
        </NuxtLinkLocale>
      </Button> -->
      <Button
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useWorkspacePath('/training')"
          active-class="!bg-accent !text-accent-foreground"
        >
          {{ $t("navigation.training") }}
        </NuxtLinkLocale>
      </Button>
      <Button
        v-if="isAuthorized()"
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useWorkspacePath('/library')"
          active-class="!bg-accent !text-accent-foreground"
        >
          {{ $t("navigation.library") }}
        </NuxtLinkLocale>
      </Button>
      <Button
        v-if="isAuthorized()"
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useWorkspacePath('/team')"
          active-class="!bg-accent !text-accent-foreground"
        >
          {{ $t("navigation.team") }}
        </NuxtLinkLocale>
      </Button>
    </nav>

    <div class="flex items-center gap-2">
      <WorkspaceSettingsDialog v-if="isAuthorized()">
        <Button
          size="icon"
          variant="ghost"
        >
          <Settings />
        </Button>
      </WorkspaceSettingsDialog>
      <CreateSimulationDialog v-if="false">
        <Button
          size="icon"
          class="hidden md:flex mr-4"
        >
          <Plus />
        </Button>
      </CreateSimulationDialog>
      <UserButton />
    </div>
  </div>
</template>
