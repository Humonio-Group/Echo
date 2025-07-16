<script setup lang="ts">
import { ChartArea, Gauge, LayoutDashboard, Plus, Users } from "lucide-vue-next";
</script>

<template>
  <div class="h-16 rounded-full bg-background border px-6 flex items-center justify-between sm:gap-8 sm:w-min sm:mx-auto">
    <Button
      size="icon"
      variant="ghost"
      class="text-muted-foreground"
      as-child
    >
      <NuxtLinkLocale
        :to="useWorkspacePath('/')"
        active-class="!text-foreground"
      >
        <LayoutDashboard class="size-5" />
      </NuxtLinkLocale>
    </Button>
    <Button
      size="icon"
      variant="ghost"
      class="text-muted-foreground"
      as-child
    >
      <NuxtLinkLocale
        :to="useWorkspacePath('/training')"
        active-class="!text-foreground"
      >
        <Gauge class="size-5" />
      </NuxtLinkLocale>
    </Button>

    <Button
      size="icon"
      class="rounded-full scale-175 -translate-y-3"
    >
      <Plus />
    </Button>

    <Button
      size="icon"
      variant="ghost"
      class="text-muted-foreground"
      as-child
    >
      <NuxtLinkLocale
        :to="useWorkspacePath('/performance')"
        active-class="!text-foreground"
      >
        <ChartArea class="size-5" />
      </NuxtLinkLocale>
    </Button>
    <Button
      size="icon"
      variant="ghost"
      class="text-muted-foreground"
      as-child
    >
      <NuxtLinkLocale
        :to="useWorkspacePath('/team')"
        active-class="!text-foreground"
      >
        <Users class="size-5" />
      </NuxtLinkLocale>
    </Button>
  </div>
</template>
