import { exec } from "child_process";
import { platform } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Résout le chemin absolu vers coverage/index.html
const __dirname = dirname(fileURLToPath(import.meta.url));
const coveragePath = join(__dirname, "../coverage/index.html");

// Commande à exécuter selon l'OS
const openCommand
    = platform() === "win32"
      ? `start "" "${coveragePath}"`
      : platform() === "darwin"
        ? `open "${coveragePath}"`
        : `xdg-open "${coveragePath}"`; // Linux

exec(openCommand, (err) => {
  if (err) {
    console.error("❌ Impossible d’ouvrir le rapport de couverture :", err);
  }
  else {
    console.log("✅ Rapport de couverture ouvert dans le navigateur.");
  }
});
