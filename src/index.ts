import path from "path";
import { fileURLToPath } from "url";
import { token } from "./handlers/EnvHandler.js";
import { loadEvents } from "./handlers/EventHandler.js";
import { client } from "./structures/client.js";
import { loadCommands } from "./handlers/CommandHandler.js";
import { initDB } from "./utils/db.js";
import { loadModules } from "./handlers/moduleHandler.js";
import { startWebService } from "./utils/alive.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    console.log("🔹 Initializing database...");
    await initDB();

    console.log("🔹 Loading modules...");
    await loadModules(client);

    console.log("🔹 Loading events...");
    await loadEvents(client, path.join(__dirname, "./events"));

    console.log("🔹 Loading commands...");
    await loadCommands(client, path.join(__dirname, "./commands"));

    console.log("🔹 Logging in to Discord...");
    await client.login(token);

    console.log(`✅ Bot is logged in as ${client.user?.tag || "unknown user"}!`);
    startWebService();
  } catch (err) {
    console.error("❌ Fatal error while starting bot:", err);
    process.exit(1);
  }
}

main();