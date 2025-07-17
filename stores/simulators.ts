import type { TArray, TNull } from "~/types/globals/utils";
import type { ISimulator } from "~/types/simulators";

interface SimulatorState {
  library: TNull<TArray<ISimulator>>;
  loading: {
    library: boolean;
  };
}

export const useSimulatorStore = defineStore("simulators", {
  state: (): SimulatorState => ({
    library: null,
    loading: {
      library: false,
    },
  }),
  getters: {
    translate: () => useNuxtApp().$i18n.t,
    isFirstLoading: state => !state.library,
  },
  actions: {
    async loadLibrary() {
      this.loading.library = true;

      try {
        const lib = await $fetch<TArray<ISimulator>>(`/api/simulators/library`);
        if (!this.library?.length) this.library = lib;
        else this.library = [...(this.library ?? []), ...lib.filter(sim => this.library?.every(s => s.id !== sim.id))];
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.library = false;
      }
    },
  },
});
