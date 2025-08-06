import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { ClarityClient } from "../../utils/types.js";

export const name = "mute";
export const description = "Mute a member by adding a 'Muted' role";

export async function execute(client: ClarityClient, message: any, args: string[]) {
  if (!message.guild) return;

  if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return message.reply("❌ You do not have permission to mute members.");
  }
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return message.reply("❌ I do not have permission to mute members.");
  }

  const member = message.mentions.members?.first() || await message.guild.members.fetch(args[0]).catch(() => null);
  if (!member) return message.reply("⚠️ Please mention a valid member to mute.");

  if (message.member.roles.highest.position <= member.roles.highest.position && message.guild.ownerId !== message.author.id) {
    return message.reply("❌ You cannot mute someone with an equal or higher role.");
  }
  if (message.guild.members.me.roles.highest.position <= member.roles.highest.position) {
    return message.reply("❌ I cannot mute someone with an equal or higher role than me.");
  }

  let mutedRole = message.guild.roles.cache.find((r: any) => r.name.toLowerCase() === "muted");
  if (!mutedRole) {
    try {
      mutedRole = await message.guild.roles.create({
        name: "Muted",
        color: "#555555",
        permissions: [],
        reason: "Mute command setup"
      });

      for (const [, channel] of message.guild.channels.cache) {
        await channel.permissionOverwrites.create(mutedRole, {
          SendMessages: false,
          Speak: false,
          AddReactions: false
        }).catch(() => {});
      }
    } catch (err) {
      return message.reply("❌ Failed to create Muted role. Check my permissions.");
    }
  }

  if (member.roles.cache.has(mutedRole.id)) {
    return message.reply("⚠️ This member is already muted.");
  }

  const reason = args.slice(1).join(" ") || "No reason provided";
  await member.roles.add(mutedRole, `Muted by ${message.author.tag}: ${reason}`);

  const embed = new EmbedBuilder()
    .setColor("#FFA500")
    .setTitle("🔇 Member Muted")
    .setDescription(`**${member.user.tag}** was muted.\n**Reason:** ${reason}`)
    .setFooter({ text: `Muted by ${message.author.tag}` })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}