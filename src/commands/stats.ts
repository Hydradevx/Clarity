import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../utils/types";

export const name = "stats";
export const description = "Shows server statistics";

export async function execute(client: ClarityClient, message: any) {
  if (!message.guild) return;

  const { guild } = message;
  const icon = guild.iconURL({ size: 1024 });

  const embed = new EmbedBuilder()
    .setColor("#00BFFF")
    .setTitle(`<:emoji_36:1401088664683155549> Server Stats — ${guild.name}`)
    .setDescription(
      [
        `<:emoji_20:1401110003791827031> **Members:** ${guild.memberCount}`,
        `<:emoji_23:1401121271609294899> **Channels:** ${guild.channels.cache.size}`,
        `<:emoji_22:1401113594879283220> **Roles:** ${guild.roles.cache.size}`,
        `<:emoji_23:1401121271609294899> **Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
      ].join("\n")
    )
    .setFooter({ text: `Requested by ${message.author.tag}` })
    .setTimestamp();

  if (icon) embed.setThumbnail(icon);

  await message.channel.send({ embeds: [embed] });
}