<script setup lang="ts">
// TODO: import { Plus } from "lucide-vue-next";
import MobileBar from "~/components/shared/app/navigation/MobileBar.vue";
import TopBar from "~/components/shared/app/navigation/TopBar.vue";

const onMobile = isMobile();
</script>

<template>
  <div
    data-layout="default"
    class="flex flex-col"
  >
    <header class="sticky top-0 py-3 px-4 bg-background">
      <TopBar />
    </header>

    <main class="px-4">
      <NuxtPage />
    </main>

    <div
      v-if="onMobile"
      class="fixed bottom-0 inset-x-0 p-4"
    >
      <!-- TODO: v-if="hasRole('admin')" -->
      <MobileBar />
      <!-- TODO:
      <Button
        v-else
        class="w-full"
        size="lg"
      >
        <Plus />
        Nouvelle simulation
      </Button>
      -->
    </div>
  </div>
</template>
