import path from "path";
import { token } from "./handlers/EnvHandler.js";
import { loadEvents } from "./handlers/EventHandler.js";
import { client } from "./structures/client.js";

loadEvents(client, path.join(__dirname, "./events"));

client.login(token)