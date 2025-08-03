import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../../utils/types";

export const name = "stats";
export const description = "Shows server statistics";

export async function execute(client: ClarityClient, message: any) {
  if (!message.guild) return;

  const { guild } = message;
  const icon = guild.iconURL({ size: 1024, dynamic: true });

  const embed = new EmbedBuilder()
    .setColor("#00BFFF")
    .setAuthor({
      name: `${guild.name} — Server Stats`,
      iconURL: icon || undefined
    })
    .setDescription(
      [
        `<:emoji_20:1401110003791827031> **Members:** ${guild.memberCount}`,
        `<:emoji_23:1401121271609294899> **Channels:** ${guild.channels.cache.size}`,
        `<:emoji_22:1401113594879283220> **Roles:** ${guild.roles.cache.size}`,
        `<:emoji_36:1401088664683155549> **Created:** <t:${Math.floor(
          guild.createdTimestamp / 1000
        )}:D> ・ <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
      ].join("\n")
    )
    .setFooter({
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (icon) embed.setThumbnail(icon);

  await message.channel.send({ embeds: [embed] });
}