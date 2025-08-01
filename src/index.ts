import path from "path";
import { token } from "./handlers/EnvHandler.js";
import { loadEvents } from "./handlers/EventHandler.js";
import { client } from "./structures/client.js";
import { loadCommands } from "./handlers/CommandHandler.js";


loadEvents(client, path.join(__dirname, "./events"));
loadCommands(client, path.join(__dirname, "./commands"))

client.login(token)