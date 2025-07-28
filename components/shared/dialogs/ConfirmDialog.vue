<script setup lang="ts">
const open = defineModel<boolean>("open");

defineEmits<{
  confirmed: [];
}>();
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ $t("dialogs.globals.confirmation.title") }}</AlertDialogTitle>
        <AlertDialogDescription>{{ $t("dialogs.globals.confirmation.caption") }}</AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>{{ $t("btn.cancel") }}</AlertDialogCancel>
        <AlertDialogAction @click="$emit('confirmed')">
          {{ $t("btn.confirm") }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
