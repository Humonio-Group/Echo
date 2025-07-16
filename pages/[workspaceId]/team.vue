<script setup lang="ts">
const store = useWorkspaceStore();
const { workspace } = storeToRefs(store);
</script>

<template>
  <main data-page="workspace.home">
    TEAM {{ workspace?.name }}
  </main>
</template>
