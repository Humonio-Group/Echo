<script setup lang="ts">
import { toast } from "vue-sonner";
</script>

<template>
  <main
    data-page="home"
    class="min-h-dvh flex flex-col gap-4 items-center justify-center"
  >
    <Button @click="toast.info('Bienvenue sur Echo !')">
      {{ $t("hello-world") }}
    </Button>
  </main>
</template>
