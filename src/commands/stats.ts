import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../utils/types";
import { getTopUsers } from "../utils/db";
import { getPrefix } from "../utils/db";

export const name = "stats";
export const aliases: string[] = [];

export async function execute(client: ClarityClient, message: any) {
  if (!message.guild) return;

  const prefix = await getPrefix(message.guild.id);
  const topUsers = await getTopUsers(message.guild.id, 3);
  const totalMembers = message.guild.memberCount;
  const totalChannels = message.guild.channels.cache.size;

  const leaderboard = topUsers
    .map((user, index) => `**${index + 1}.** <@${user.user_id}> — ${user.count} msgs`)
    .join("\n") || "No messages yet!";

  const embed = new EmbedBuilder()
    .setColor("#00BFFF")
    .setTitle(`📊 Server Stats — ${message.guild.name}`)
    .setThumbnail(message.guild.iconURL({ size: 1024 }) || undefined)
    .addFields(
      { name: "👥 Members", value: `${totalMembers}`, inline: true },
      { name: "📂 Channels", value: `${totalChannels}`, inline: true },
      { name: "🔹 Prefix", value: `\`${prefix}\``, inline: true },
      { name: "🏆 Top Users", value: leaderboard, inline: false },
    )
    .setFooter({ text: `Requested by ${message.author.tag}` })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}