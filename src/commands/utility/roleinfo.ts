import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../../utils/types.js";
import { Emojis } from "../../utils/emojiConfig.js";

export const name = "roleinfo";
export const description = "Shows info about a role";

export async function execute(client: ClarityClient, message: any, args: string[]) {
  if (!message.guild) return;
  const role =
    message.mentions.roles.first() ||
    message.guild.roles.cache.find((r: any) => r.name.toLowerCase() === args.join(" ").toLowerCase());

  if (!role) return message.reply("Please mention a valid role or provide its name.");

  const embed = new EmbedBuilder()
    .setColor(role.color || "#00BFFF")
    .setTitle(`${Emojis.utility} Role Info — ${role.name}`)
    .setDescription(
      [
        `**ID:** ${role.id}`,
        `**Color:** ${role.hexColor}`,
        `**Members:** ${role.members.size}`,
        `**Position:** ${role.position}`,
        `**Created:** <t:${Math.floor(role.createdTimestamp / 1000)}:R>`
      ].join("\n")
    )
    .setFooter({
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}