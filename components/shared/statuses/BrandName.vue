<script setup lang="ts">
const store = useWorkspaceStore();
const { workspace } = storeToRefs(store);
</script>

<template>
  <p class="text-primary font-bold lowercase">
    {{ workspace ? workspace.name : $t("brand.name") }}.
  </p>
</template>
