<script setup lang="ts">
const { t } = useI18n();

const store = useWorkspaceStore();
const { workspace } = storeToRefs(store);

useHead({
  title: t("brand.seo.workspace.home", { workspace: workspace.value?.name }),
});
</script>

<template>
  <main data-page="workspace.home">
    HOME {{ workspace?.name }}
  </main>
</template>
