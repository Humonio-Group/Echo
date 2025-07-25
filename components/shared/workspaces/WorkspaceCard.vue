<script setup lang="ts">
import type { IWorkspace } from "~/types/workspaces";

defineProps<{
  workspace: IWorkspace;
}>();
</script>

<template>
  <Card class="isolate relative hover:bg-accent hover:text-accent-foreground transition-colors duration-100">
    <CardContent class="flex items-center gap-3">
      <Avatar class="rounded-md">
        <AvatarImage
          v-if="workspace.picture"
          :src="workspace.picture"
        />
        <AvatarFallback>{{ workspace.name.substring(0, 2) }}</AvatarFallback>
      </Avatar>

      <p class="font-medium">
        {{ workspace.name }}
      </p>
    </CardContent>

    <NuxtLinkLocale
      :to="`/${workspace.id}/training`"
      class="absolute inset-0 z-[1]"
    />
  </Card>
</template>
