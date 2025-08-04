import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../../utils/types";
import { getUserMessageCount } from "../../utils/db";
import { Emojis } from "../../utils/emojiConfig";

export const name = "messages";
export const description = "Check your total message count in this server";

export async function execute(client: ClarityClient, message: any) {
  if (!message.guild) return;

  const count = await getUserMessageCount(message.guild.id, message.author.id);

  const embed = new EmbedBuilder()
    .setColor("#FFD700")
    .setAuthor({
      name: `${message.author.username}'s Message Stats`,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTitle(`${Emojis.bolt}`)
    .setDescription(
      `📨 You have sent **${count.toLocaleString()} messages** in **${message.guild.name}**!`
    )
    .setFooter({
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}