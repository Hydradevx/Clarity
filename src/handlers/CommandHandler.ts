import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { Collection } from "discord.js";
import { ClarityClient } from "../utils/types.js";

export async function loadCommands(client: ClarityClient, commandsPath: string) {
  client.commands = new Collection();

  const categoryMap: Record<string, string> = {
    general: "General",
    utility: "Utility",
    management: "Management",
    moderation: "Moderation",
    fun: "Fun"
  };

  async function scanDir(dir: string, category: string | null = null) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subCategory = categoryMap[entry.name.toLowerCase()] || entry.name;
        await scanDir(fullPath, subCategory);
      } else if (entry.name.endsWith(".js")) {
        const fileUrl = pathToFileURL(fullPath).href;

        try {
          const commandModule = await import(fileUrl);
          const command = commandModule.default || commandModule;

          if (!command.name || !command.execute) {
            console.warn(`Skipping invalid command: ${entry.name}`);
            continue;
          }

          const cmd = { ...command, category: category || "General" };

          client.commands.set(cmd.name, cmd);

          if (cmd.aliases) {
            for (const alias of cmd.aliases) {
              client.commands.set(alias, cmd);
            }
          }

          console.log(`Loaded command: ${cmd.name} (${cmd.category})`);
        } catch (err) {
          console.error(`❌ Failed to load command ${entry.name}:`, err);
        }
      }
    }
  }

  await scanDir(commandsPath);
}