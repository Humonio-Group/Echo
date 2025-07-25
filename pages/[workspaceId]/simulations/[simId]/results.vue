<script setup lang="ts">
import { Radar } from "vue-chartjs";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler } from "chart.js";
import branding from "~/branding";

definePageMeta({
  layout: "chat",
  resultButton: false,
});

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler);

const store = useRoomStore();
const { conversation } = storeToRefs(store);

await store.fetchRoomConversation(useRoute().params.simId as string);

const assessments = computed(() => conversation.value?.assessments ?? []);
const parseJSONToChartData = (json: string) => {
  const init = JSON.parse(json);

  const labels = Object.keys(init.data);
  const values = Object.values(init.data).map(v => Number(v) * 20);

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
          :id="`assessment-${assessment.id}`"
          :options="{
            responsive: true,
            scales: {
              r: {
                min: 0,
                max: 20,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }"
          :data="parseJSONToChartData(assessment.data)"
        />
        <p class="whitespace-pre-wrap leading-loose">
          {{ assessment.debrief }}
        </p>
      </div>
    </div>
  </main>
</template>
