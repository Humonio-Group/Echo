import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { nanoid } from "nanoid";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const avatarFile = form?.find(field => field.name === "avatar");

  if (!avatarFile) {
    throw createError({ statusCode: 400, statusMessage: "No avatar file" });
  }

  // Validations
  if (!avatarFile.type?.startsWith("image/")) {
    throw createError({ statusCode: 400, statusMessage: "File must be an image" });
  }

  // Validation de la taille (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (avatarFile.data.length > maxSize) {
    throw createError({ statusCode: 400, statusMessage: "File too large (max 5MB)" });
  }

  // Génération d'un nom de fichier unique et sécurisé
  const extension = avatarFile.filename?.split(".").pop()?.toLowerCase();
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

  if (!extension || !allowedExtensions.includes(extension)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid file extension" });
  }

  const filename = `${nanoid()}.${extension}`;
  const uploadDir = join(process.cwd(), "public", "uploads", "avatars");
  const filePath = join(uploadDir, filename);

  // Créer le dossier s'il n'existe pas
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Sauvegarder le fichier
  await writeFile(filePath, avatarFile.data);

  // Retourner l'URL publique
  return {
    url: `/uploads/avatars/${filename}`,
    filename,
    size: avatarFile.data.length,
    type: avatarFile.type,
  };
});
