export const useWait = async (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

export const useMinMaxRandom = (min: number, max: number) => (Math.random() * (max - min)) + min;

export const useBrandName = () => useNuxtApp().$i18n.t("brand.name");
