import { Message } from "discord.js";
import { ClarityClient } from "../utils/types";

export const name = "messageCreate";
export const once = false;

const PREFIX = "$";

export async function execute(client: ClarityClient, message: Message) {
  if (!message.content || message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command = (client as any).commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(client, message, args);
  } catch (err) {
    console.error(`❌ Error executing command ${commandName}:`, err);
    await message.reply("⚠️ There was an error while executing that command!");
  }
}