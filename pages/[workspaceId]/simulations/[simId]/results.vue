<script setup lang="ts">
import { Radar } from "vue-chartjs";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import branding from "~/branding";

const { t } = useI18n();

definePageMeta({
  layout: "chat",
  resultButton: false,
});

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const store = useRoomStore();
const { conversation } = storeToRefs(store);

useHead({
  title: t("brand.seo.workspace.conversation.results", { brand: useBrandName(), conv_id: conversation.value?.uid }),
});

await store.fetchRoomConversation(useRoute().params.simId as string);

const assessments = computed(() => (conversation.value?.assessments ?? []).sort((a, b) => a.id - b.id));
const parseJSONToChartData = (json: string) => {
  const init = JSON.parse(json);

  const labels = Object.keys(init.data);
  const values = Object.values(init.data).map(v => Number(v));

  return {
    labels,
    datasets: [
      {
        data: values,
        fill: true,
        backgroundColor: branding.chartPrimary,
      },
    ],
  };
};
const parseJSONToChartOptions = (json: string) => {
  const init = JSON.parse(json);

  return {
    responsive: true,
    scales: {
      r: {
        min: Number(init.axes.min),
        max: Number(init.axes.max),
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return `${context.label}: ${context.raw}/${Number(init.axes.max)}`;
          },
        },
      },
    },
  };
};
</script>

<template>
  <main
    data-page="chat.results"
    class="flex-1 overflow-auto grid justify-items-center divide-y"
  >
    <div class="w-[min(720px,100%)] flex flex-col">
      <div
        v-for="assessment in assessments"
        :key="assessment.id"
        class="flex flex-col p-6"
      >
        <Radar
          v-if="assessment.type === 'graph'"
          :id="`assessment-${assessment.id}`"
          :options="parseJSONToChartOptions(assessment.data)"
          :data="parseJSONToChartData(assessment.data)"
        />

        <p
          v-if="assessment.type === 'text'"
          class="whitespace-pre-wrap leading-loose"
        >
          {{ assessment.debrief }}
        </p>
      </div>
    </div>
  </main>
</template>
