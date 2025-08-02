import { setPrefix, getPrefix } from "../utils/db";
import { ClarityClient } from "../utils/types";

export const name = "prefix";
export const aliases: string[] = [];

export async function execute(client: ClarityClient, message: any, args: string[]) {
  if (!message.guild) return;

  if (args.length === 0) {
    const current = await getPrefix(message.guild.id);
    return message.channel.send(`🔹 Current prefix is: \`${current}\``);
  }

  const newPrefix = args[0];
  if (newPrefix.length > 5) {
    return message.channel.send("⚠️ Prefix too long! (Max 5 characters)");
  }

  setPrefix(message.guild.id, newPrefix);
  return message.channel.send(`✅ Prefix updated to: \`${newPrefix}\``);
}