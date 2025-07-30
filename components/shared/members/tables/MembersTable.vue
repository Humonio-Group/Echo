<script setup lang="ts">
import { columns } from "~/components/shared/members/tables/member-table.columns";

const { members } = storeToRefs(useMembersStore());
</script>

<template>
  <DataTable
    :columns="columns"
    :data="members"
  />
</template>
