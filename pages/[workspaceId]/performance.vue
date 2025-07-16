<script setup lang="ts">
const store = useWorkspaceStore();
const { workspace } = storeToRefs(store);
</script>

<template>
  <main data-page="workspace.home">
    PERFORMANCE {{ workspace?.name }}
  </main>
</template>
