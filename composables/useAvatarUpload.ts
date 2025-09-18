export const useAvatarUpload = () => {
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  /**
   * Upload un avatar vers le serveur
   */
  async function uploadAvatar(file: File): Promise<string | null> {
    isUploading.value = true;
    uploadError.value = null;

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { url } = await $fetch<{ url: string }>("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      return url;
    }
    catch (error) {
      console.error("Erreur upload avatar:", error);
      uploadError.value = error instanceof Error ? error.message : "Erreur lors de l'upload";
      return null;
    }
    finally {
      isUploading.value = false;
    }
  }

  /**
   * Supprime un avatar du serveur
   */
  async function deleteAvatar(url: string): Promise<boolean> {
    try {
      await $fetch("/api/simulations/avatar", {
        method: "DELETE",
        body: { url },
      });
      return true;
    }
    catch (error) {
      console.error("Erreur suppression avatar:", error);
      return false;
    }
  }

  /**
   * Génère un aperçu local d'une image
   */
  function createPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        }
        else {
          reject(new Error("Impossible de lire le fichier"));
        }
      };
      reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Redimensionne une image pour optimiser l'upload
   */
  function resizeImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Calcul des nouvelles dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        }
        else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Redimensionnement
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Conversion en blob
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          }
          else {
            resolve(file); // Fallback vers le fichier original
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  return {
    isUploading: readonly(isUploading),
    uploadError: readonly(uploadError),
    uploadAvatar,
    deleteAvatar,
    createPreview,
    resizeImage,
  };
};
