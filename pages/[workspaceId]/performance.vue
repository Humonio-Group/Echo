<script setup lang="ts">
const { t } = useI18n();

const store = useWorkspaceStore();
const { workspace } = storeToRefs(store);

useHead({
  title: t("brand.seo.workspace.performance", { workspace: workspace.value?.name }),
});
</script>

<template>
  <main data-page="workspace.home">
    PERFORMANCE {{ workspace?.name }}
  </main>
</template>
