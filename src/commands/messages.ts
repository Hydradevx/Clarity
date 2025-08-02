import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../utils/types";
import { getUserMessageCount } from "../utils/db";

export const name = "messages";
export const aliases: string[] = ["msgs", "mcount"];

export async function execute(client: ClarityClient, message: any, args: string[]) {
  if (!message.guild) return;

  const target = message.mentions.users.first() || message.author;
  const count = await getUserMessageCount(message.guild.id, target.id);

  const embed = new EmbedBuilder()
    .setColor("#FFD700")
    .setTitle("💬 Message Count")
    .setDescription(`**${target.tag}** has sent **${count}** messages in this server.`)
    .setFooter({ text: `Requested by ${message.author.tag}` })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}