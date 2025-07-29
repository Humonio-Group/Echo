<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: "auth",
});

useHead({
  title: t("brand.seo.auth.sign-up", { brand: useBrandName() }),
});
</script>

<template>
  <main data-page="sign-up">
    <SignUp />
  </main>
</template>
