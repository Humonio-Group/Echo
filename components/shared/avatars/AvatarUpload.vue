<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-vue-next";

interface Props {
  modelValue?: string | null;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  disabled: false,
  placeholder: "Ajouter un avatar",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  "upload": [file: File];
  "remove": [];
}>();

const fileInput = ref<HTMLInputElement>();
const dragOver = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);
const previewUrl = ref<string | null>(null);

// Tailles des avatars
const sizeClasses = computed(() => {
  const sizes = {
    sm: "size-12",
    md: "size-20",
    lg: "size-32",
  };
  return sizes[props.size];
});

// URL d'aperçu (soit le modelValue, soit le preview local)
const displayUrl = computed(() => previewUrl.value || props.modelValue);

// Nettoyage de l'URL d'aperçu lors de la destruction
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

function validateFile(file: File): string | null {
  // Vérifier le type
  if (!file.type.startsWith("image/")) {
    return "Le fichier doit être une image";
  }

  // Vérifier la taille (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return "L'image ne doit pas dépasser 5MB";
  }

  // Vérifier les formats supportés
  const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!supportedTypes.includes(file.type)) {
    return "Format non supporté. Utilisez JPG, PNG, WebP ou GIF";
  }

  return null;
}

function handleFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file: File) {
  error.value = null;
  isLoading.value = true;

  // Validation
  const validationError = validateFile(file);
  if (validationError) {
    error.value = validationError;
    isLoading.value = false;
    return;
  }

  // Nettoyage de l'ancien preview
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  // Création du nouveau preview
  previewUrl.value = URL.createObjectURL(file);

  // Simulation d'un délai de chargement pour l'UX
  setTimeout(() => {
    isLoading.value = false;
    emit("upload", file);
  }, 500);
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  dragOver.value = false;

  if (props.disabled) return;

  const file = event.dataTransfer?.files[0];
  if (file) {
    processFile(file);
  }
}

function handleRemove() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  emit("update:modelValue", null);
  emit("remove");

  // Reset de l'input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

function openFileDialog() {
  if (!props.disabled) {
    fileInput.value?.click();
  }
}
</script>

<template>
  <div class="relative group">
    <!-- Zone de drop principale -->
    <div
      :class="[
        'relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden outline-2 outline-dashed',
        sizeClasses,
        dragOver ? 'outline-primary bg-primary/5' : 'outline-muted-foreground/25',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:outline-primary/50',
        error ? 'outline-destructive' : '',
      ]"
      @click="openFileDialog"
      @dragover.prevent="!disabled && (dragOver = true)"
      @dragleave="dragOver = false"
      @drop="handleDrop"
    >
      <!-- Avatar avec image -->
      <Avatar
        v-if="displayUrl"
        :class="sizeClasses"
      >
        <AvatarImage
          :src="displayUrl"
          class="object-cover"
        />
        <AvatarFallback>
          <ImageIcon :class="size === 'sm' ? 'size-4' : size === 'md' ? 'size-6' : 'size-8'" />
        </AvatarFallback>
      </Avatar>

      <!-- État vide -->
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground"
      >
        <Upload :class="size === 'sm' ? 'size-4' : size === 'md' ? 'size-6' : 'size-8'" />
        <span
          v-if="size !== 'sm'"
          class="text-xs text-center px-1"
        >{{ placeholder }}</span>
      </div>

      <!-- Overlay de chargement -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
      >
        <Loader2 :class="['animate-spin', size === 'sm' ? 'size-4' : 'size-6']" />
      </div>

      <!-- Overlay au hover -->
      <div
        v-if="displayUrl && !isLoading && !disabled"
        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <Upload class="size-4 text-white" />
      </div>
    </div>

    <!-- Bouton de suppression -->
    <Button
      v-if="displayUrl && !disabled"
      variant="destructive"
      size="icon"
      class="absolute -top-2 -right-2 size-6 rounded-full shadow-md"
      @click.stop="handleRemove"
    >
      <X class="size-3" />
    </Button>

    <!-- Input file caché -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      class="hidden"
      :disabled="disabled"
      @change="handleFileSelect"
    >
  </div>

  <!-- Message d'erreur -->
  <p
    v-if="error"
    class="text-sm text-destructive mt-1"
  >
    {{ error }}
  </p>
</template>
