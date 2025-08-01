import fs from "fs";
import path from "path";
import { Collection } from "discord.js";
import { ClarityClient } from "../utils/types";

export async function loadCommands(client: ClarityClient, commandsPath: string) {
  client.commands = new Collection();

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath); 
      } else if (entry.name.endsWith(".ts")) {
        import(fullPath).then(command => {
          if (!command.name || !command.execute) {
            console.warn(`Skipping invalid command: ${entry.name}`);
            return;
          }

          client.commands.set(command.name, command);

          if (command.aliases) {
            for (const alias of command.aliases) {
              client.commands.set(alias, command);
            }
          }

          console.log(`Loaded command: ${command.name}`);
        });
      }
    }
  }

  scanDir(commandsPath);
}