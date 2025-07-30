<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import MembersTable from "~/components/shared/members/tables/MembersTable.vue";
import AddMemberDialog from "~/components/shared/members/dialogs/AddMemberDialog.vue";

const { t } = useI18n();

const { workspace } = storeToRefs(useWorkspaceStore());
useHead({
  title: t("brand.seo.workspace.team", { workspace: workspace.value?.name }),
});

const store = useMembersStore();
store.fetchMembers();
</script>

<template>
  <main
    data-page="workspace.home"
    class="flex flex-col gap-2"
  >
    <header class="flex items-center gap-2">
      <Input
        :placeholder="$t('labels.search')"
        disabled
      />
      <AddMemberDialog>
        <Button>
          <Plus />
          {{ $t("btn.add.default") }}
        </Button>
      </AddMemberDialog>
    </header>

    <MembersTable />
  </main>
</template>
