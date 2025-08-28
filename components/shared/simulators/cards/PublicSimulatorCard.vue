<script setup lang="ts">
import type { ISimulator } from "~/types/simulators";
import { CopyPlus, LoaderCircle } from "lucide-vue-next";

const props = defineProps<{
  simulator: ISimulator;
}>();
const emit = defineEmits<{
  duplicated: [];
}>();

const store = useWorkspaceStore();
const { loading } = storeToRefs(store);
const isLoading = computed(() => loading.value.duplicatingSimulator.includes(props.simulator.id));

async function duplicate() {
  await store.duplicateSimulator(props.simulator.id);
  emit("duplicated");
}
</script>

<template>
  <Card>
    <CardContent class="flex flex-row items-center gap-3">
      <Avatar class="size-10 rounded-md">
        <AvatarImage
          v-if="simulator.picture"
          :src="simulator.picture"
        />
        <AvatarFallback>{{ simulator.title.substring(0, 2) }}</AvatarFallback>
      </Avatar>

      <div class="grid flex-1 mr-3">
        <p class="font-semibold truncate">
          {{ simulator.title }}
        </p>
        <span class="text-sm text-muted-foreground truncate">{{ simulator.description }}</span>
      </div>

      <Button
        size="icon"
        variant="ghost"
        :disabled="isLoading"
        @click="duplicate"
      >
        <LoaderCircle
          v-if="isLoading"
          class="animate-spin"
        />
        <CopyPlus v-else />
      </Button>
    </CardContent>
  </Card>
</template>
