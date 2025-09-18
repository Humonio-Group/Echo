// server/api/uploads/[...path].get.ts
import { readFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");

  console.log(path);

  try {
    const filePath = join(process.cwd(), "public", "uploads", "avatars", path ?? "");
    console.log(filePath);
    const file = await readFile(filePath);

    // Déterminer le content-type
    const ext = path?.split(".").pop()?.toLowerCase() ?? ".";
    const contentType = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
    }[ext] || "application/octet-stream";

    setHeader(event, "content-type", contentType);
    return file;
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }
});
