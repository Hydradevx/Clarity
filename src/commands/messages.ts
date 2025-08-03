import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../utils/types";
import { getUserMessageCount } from "../utils/db";

export const name = "messages";
export const description = "Check your total message count in this server";

export async function execute(client: ClarityClient, message: any) {
  if (!message.guild) return;

  const count = await getUserMessageCount(message.guild.id, message.author.id);

  const embed = new EmbedBuilder()
    .setColor("#FFD700")
    .setTitle(`<:emoji_20:1401110003791827031> Message Stats`)
    .setDescription(
      `You have sent **${count} messages** in **${message.guild.name}**!`
    )
    .setFooter({ text: `Requested by ${message.author.tag}` })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}