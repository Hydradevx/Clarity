import path from "path";
import { token } from "./handlers/EnvHandler.js";
import { loadEvents } from "./handlers/EventHandler.js";
import { client } from "./structures/client.js";
import { loadCommands } from "./handlers/CommandHandler.js";
import { initDB } from "./utils/db.js";
import { loadModules } from "./handlers/moduleHandler.js";
import { startWebService } from "./utils/alive.js";

loadEvents(client, path.join(__dirname, "./events"));
loadCommands(client, path.join(__dirname, "./commands"));

(async () => {
  await initDB();
  client.login(token)
  await loadModules(client)
  startWebService();
})();