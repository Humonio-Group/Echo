<script setup lang="ts">
import "vue-sonner/style.css";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <Toaster
      position="top-center"
      rich-colors
    />
    <NuxtLayout />
  </div>
</template>
