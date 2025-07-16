<script setup lang="ts">
// TODO: import { Plus } from "lucide-vue-next";
import MobileBar from "~/components/shared/app/navigation/MobileBar.vue";
import TopBar from "~/components/shared/app/navigation/TopBar.vue";

const onMobile = isMobile();
</script>

<template>
  <div
    data-layout="default"
    class="flex flex-col min-h-dvh"
  >
    <header class="sticky top-0 py-3 px-4 bg-background">
      <TopBar />
    </header>

    <main class="flex-1 flex flex-col px-4">
      <NuxtPage class="flex-1" />
    </main>

    <div
      v-if="onMobile"
      class="sticky bottom-0 p-4"
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
