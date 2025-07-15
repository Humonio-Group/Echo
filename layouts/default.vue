<script setup lang="ts">
import BrandName from "~/components/shared/statuses/BrandName.vue";
</script>

<template>
  <div data-layout="default">
    <header class="flex items-center py-4 px-6 justify-between border-b">
      <BrandName />

      <UserButton />
    </header>
    <main class="py-4 px-6">
      <NuxtPage />
    </main>
  </div>
</template>
