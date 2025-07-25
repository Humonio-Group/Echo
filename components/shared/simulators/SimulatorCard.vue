<script setup lang="ts">
import { CopyPlus, LoaderCircle } from "lucide-vue-next";
import type { ISimulator } from "~/types/simulators";

const props = defineProps<{
  simulator: ISimulator;
  duplicable?: boolean;
}>();
const emit = defineEmits<{
  duplicated: [];
}>();

const detailsOpened = ref<boolean>(false);

const store = useWorkspaceStore();
const { loading } = storeToRefs(store);

const isLoading = computed(() => loading.value.duplicatingSimulator.includes(props.simulator.id));

async function duplicate() {
  await store.duplicateSimulator(props.simulator.id);
  emit("duplicated");
}
</script>

<template>
  <Card
    class="gap-4 py-4"
    @click="() => {
      if (!duplicable) return;
      detailsOpened = true;
    }"
  >
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
      <CardTitle class="text-sm truncate">
        {{ simulator.title }}
      </CardTitle>
      <CardDescription class="text-xs line-clamp-2">
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
        :disabled="isLoading"
        @click="duplicate"
      >
        <LoaderCircle
          v-if="isLoading"
          class="animate-spin"
        />
        <CopyPlus v-else />
        {{ $t("btn.duplicate") }}
      </Button>
    </CardFooter>

    <Sheet
      v-if="duplicable"
      v-model:open="detailsOpened"
    >
      <SheetContent class="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{{ simulator.title }}</SheetTitle>
          <SheetDescription>{{ simulator.description }}</SheetDescription>
        </SheetHeader>

        <div class="grid divide-y px-4">
          <section class="grid pb-6 gap-2">
            <p class="text-sm font-medium text-muted-foreground">
              Behavior prompt
            </p>
            <p class="whitespace-pre-wrap">
              {{ simulator.behaviorPrompt }}
            </p>
          </section>

          <section
            v-for="evaluation in simulator.evaluations ?? []"
            :key="evaluation.key"
            class="grid py-6 gap-2"
          >
            <p class="text-sm font-medium text-muted-foreground">
              Framework prompt
            </p>
            <p class="whitespace-pre-wrap">
              {{ evaluation.frameworkPrompt || "-" }}
            </p>
            <p class="text-sm font-medium text-muted-foreground">
              Assessment prompt
            </p>
            <p class="whitespace-pre-wrap">
              {{ evaluation.assessmentPrompt }}
            </p>
            <p class="text-sm font-medium text-muted-foreground">
              Debrief prompt
            </p>
            <p class="whitespace-pre-wrap">
              {{ evaluation.feedbackPrompt }}
            </p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  </Card>
</template>
