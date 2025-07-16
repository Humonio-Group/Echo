<script setup lang="ts">
const store = useWorkspaceStore();
const { workspace } = storeToRefs(store);
</script>

<template>
  <p class="bg-gradient-to-r from-primary to-primary-gradient bg-clip-text text-transparent font-bold lowercase">
    {{ workspace ? workspace.name : $t("brand.name") }}.
  </p>
</template>
