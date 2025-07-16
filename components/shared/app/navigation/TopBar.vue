<script setup lang="ts">
import { Home, Plus, Settings } from "lucide-vue-next";
import BrandName from "~/components/shared/statuses/BrandName.vue";
</script>

<template>
  <div class="flex items-center justify-between md:justify-start gap-4 md:gap-12">
    <BrandName />

    <nav class="flex-1 items-center gap-1 hidden md:flex">
      <Button
        size="icon"
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useWorkspacePath('/')"
          active-class="!bg-accent !text-accent-foreground"
        >
          <Home />
        </NuxtLinkLocale>
      </Button>
      <Button
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useWorkspacePath('/training')"
          active-class="!bg-accent !text-accent-foreground"
        >
          {{ $t("navigation.training") }}
        </NuxtLinkLocale>
      </Button>
      <Button
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useWorkspacePath('/performance')"
          active-class="!bg-accent !text-accent-foreground"
        >
          {{ $t("navigation.performance") }}
        </NuxtLinkLocale>
      </Button>
      <Button
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useWorkspacePath('/team')"
          active-class="!bg-accent !text-accent-foreground"
        >
          {{ $t("navigation.team") }}
        </NuxtLinkLocale>
      </Button>
    </nav>

    <div class="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
      >
        <Settings />
      </Button>
      <Button
        size="icon"
        class="hidden md:flex mr-4"
      >
        <Plus />
      </Button>
      <UserButton />
    </div>
  </div>
</template>
