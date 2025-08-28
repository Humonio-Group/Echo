<script setup lang="ts">
import { columns } from "./library-table.columns";

const store = useWorkspaceStore();
</script>

<template>
  <DataTable
    :columns="columns"
    :data="store.simulators"
  />
</template>
