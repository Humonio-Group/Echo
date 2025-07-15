<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import type { IWorkspace } from "~/types/workspaces";
import WorkspaceCard from "~/components/shared/workspaces/WorkspaceCard.vue";
import CreateWorkspaceDialog from "~/components/shared/workspaces/dialogs/CreateWorkspaceDialog.vue";

definePageMeta({
  layout: "auth",
});

const workspaces: IWorkspace[] = [
  /* {
    id: 1,
    name: "Humonio",
    description: null,
    picture: null,
    companyInfo: "Humonio",
    productOrService: "Humonio",
    values: "Humonio",
    ownerId: "loicmaes",
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [],
  }, */
];
</script>

<template>
  <main
    data-page="home"
    class="w-full max-w-lg min-h-dvh flex flex-col gap-4"
  >
    <header class="flex items-center justify-between py-4">
      <p class="font-bold bg-gradient-to-r from-primary to-primary-gradient text-transparent bg-clip-text">
        echo.
      </p>

      <UserButton />
    </header>

    <main

      class="flex-1 flex flex-col gap-3"
    >
      <template v-if="workspaces.length">
        <WorkspaceCard
          v-for="workspace in workspaces"
          :key="workspace.id"
          :workspace="workspace"
        />
      </template>
      <div
        v-else
        class="my-auto flex flex-col items-center gap-4"
      >
        <p class="text-center text-muted-foreground">
          {{ $t("labels.empty.workspaces") }}
        </p>

        <CreateWorkspaceDialog>
          <Button>
            <Plus />
            {{ $t("btn.add.workspace") }}
          </Button>
        </CreateWorkspaceDialog>
      </div>
    </main>

    <footer
      v-if="workspaces.length"
      class="flex flex-col"
    >
      <CreateWorkspaceDialog>
        <Button>
          <Plus />
          {{ $t("btn.add.workspace") }}
        </Button>
      </CreateWorkspaceDialog>
    </footer>
  </main>
</template>
