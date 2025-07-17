<script setup lang="ts">
import { CopyPlus } from "lucide-vue-next";
import type { ISimulator } from "~/types/simulators";

const props = defineProps<{
  simulator: ISimulator;
  duplicable?: boolean;
}>();
const emit = defineEmits<{
  duplicated: [ISimulator];
}>();

const store = useWorkspaceStore();

async function duplicate() {
  await store.duplicateSimulator(props.simulator.id);
  emit("duplicated");
}
</script>

<template>
  <Card class="gap-4 py-4">
    <CardHeader class="px-4 flex flex-col items-center gap-2">
      <Avatar class="size-12">
        <AvatarImage
          v-if="simulator.picture"
          :src="simulator.picture"
        />
        <AvatarFallback>{{ simulator.title.substring(0, 2) }}</AvatarFallback>
      </Avatar>
    </CardHeader>
    <CardContent class="px-4">
      <CardTitle class="text-sm">
        {{ simulator.title }}
      </CardTitle>
      <CardDescription class="text-xs">
        {{ simulator.description }}
      </CardDescription>
    </CardContent>
    <CardFooter
      v-if="duplicable"
      class="px-4"
    >
      <Button
        size="sm"
        class="w-full"
        @click="duplicate"
      >
        <CopyPlus />
        {{ $t("btn.duplicate") }}
      </Button>
    </CardFooter>
  </Card>
</template>
