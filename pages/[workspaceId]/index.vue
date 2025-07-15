<script setup lang="ts">
const store = useWorkspaceStore();
const { workspace } = storeToRefs(store);
</script>

<template>
  <main data-page="workspace.home">
    HOME {{ workspace?.name }}
  </main>
</template>
