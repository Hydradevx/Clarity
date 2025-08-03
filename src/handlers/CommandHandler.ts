import fs from "fs";
import path from "path";
import { Collection } from "discord.js";
import { ClarityClient } from "../utils/types";

export async function loadCommands(client: ClarityClient, commandsPath: string) {
  client.commands = new Collection();

  const categoryMap: Record<string, string> = {
    general: "General",
    utility: "Utility",
    management: "Management",
    moderation: "Moderation",
    fun: "Fun"
  };

  function scanDir(dir: string, category: string | null = null) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subCategory = categoryMap[entry.name.toLowerCase()] || entry.name;
        scanDir(fullPath, subCategory);
      } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) {
        import(fullPath).then(command => {
          if (!command.name || !command.execute) {
            console.warn(`Skipping invalid command: ${entry.name}`);
            return;
          }

          (command as any).category = category || "General";

          client.commands.set(command.name, command);

          if (command.aliases) {
            for (const alias of command.aliases) {
              client.commands.set(alias, command);
            }
          }

          console.log(`Loaded command: ${command.name} (${command.category})`);
        });
      }
    }
  }

  scanDir(commandsPath);
}