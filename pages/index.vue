<script setup lang="ts">
import { LoaderCircle, Plus } from "lucide-vue-next";
import WorkspaceCard from "~/components/shared/workspaces/WorkspaceCard.vue";
import CreateWorkspaceDialog from "~/components/shared/workspaces/dialogs/CreateWorkspaceDialog.vue";
import BrandName from "~/components/shared/statuses/BrandName.vue";

definePageMeta({
  layout: "auth",
});

const store = useWorkspaceStore();
const { workspaces, loading } = storeToRefs(store);

store.clearWorkspace();
</script>

<template>
  <main
    data-page="home"
    class="w-full max-w-lg min-h-dvh sm:min-h-auto flex flex-col gap-4"
  >
    <header class="flex items-center justify-between py-4">
      <BrandName />

      <UserButton />
    </header>

    <main class="flex-1 sm:flex-auto flex flex-col gap-3">
      <template v-if="workspaces?.length">
        <WorkspaceCard
          v-for="workspace in workspaces"
          :key="workspace.id"
          :workspace="workspace"
        />

        <LoaderCircle
          v-if="loading.workspaces"
          class="animate-spin self-center"
        />
      </template>
      <div
        v-else
        class="my-auto flex flex-col items-center gap-4"
      >
        <LoaderCircle
          v-if="loading.workspaces"
          class="animate-spin"
        />
        <p
          v-else
          class="text-center text-muted-foreground"
        >
          {{ $t("labels.empty.workspaces") }}
        </p>

        <template v-if="!store.isFirstLoading">
          <CreateWorkspaceDialog>
            <Button>
              <Plus />
              {{ $t("btn.add.workspace") }}
            </Button>
          </CreateWorkspaceDialog>
        </template>
      </div>
    </main>

    <footer
      v-if="!store.isFirstLoading && workspaces?.length"
      class="flex flex-col sm:items-center py-4"
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
