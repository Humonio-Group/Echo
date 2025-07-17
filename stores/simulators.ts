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
        this.library = await $fetch<TArray<ISimulator>>(`/api/simulators/library`);
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
