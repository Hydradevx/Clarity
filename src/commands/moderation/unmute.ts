import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { ClarityClient } from "../../utils/types.js";

export const name = "unmute";
export const description = "Unmute a member by removing the 'Muted' role";

export async function execute(client: ClarityClient, message: any, args: string[]) {
  if (!message.guild) return;

  if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return message.reply("❌ You do not have permission to unmute members.");
  }
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return message.reply("❌ I do not have permission to unmute members.");
  }

  const member = message.mentions.members?.first() || await message.guild.members.fetch(args[0]).catch(() => null);
  if (!member) return message.reply("⚠️ Please mention a valid member to unmute.");

  const mutedRole = message.guild.roles.cache.find((r: any) => r.name.toLowerCase() === "muted");
  if (!mutedRole || !member.roles.cache.has(mutedRole.id)) {
    return message.reply("⚠️ This member is not muted.");
  }

  if (message.member.roles.highest.position <= member.roles.highest.position && message.guild.ownerId !== message.author.id) {
    return message.reply("❌ You cannot unmute someone with an equal or higher role.");
  }
  if (message.guild.members.me.roles.highest.position <= member.roles.highest.position) {
    return message.reply("❌ I cannot unmute someone with an equal or higher role than me.");
  }

  const reason = args.slice(1).join(" ") || "No reason provided";
  await member.roles.remove(mutedRole, `Unmuted by ${message.author.tag}: ${reason}`);

  const embed = new EmbedBuilder()
    .setColor("#00FF7F")
    .setTitle("🔊 Member Unmuted")
    .setDescription(`**${member.user.tag}** was unmuted.\n**Reason:** ${reason}`)
    .setFooter({ text: `Unmuted by ${message.author.tag}` })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}