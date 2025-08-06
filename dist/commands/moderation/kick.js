import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
export const name = "kick";
export const description = "Kick a member from the server";
export async function execute(client, message, args) {
    if (!message.guild)
        return;
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
        return message.reply("❌ You do not have permission to kick members.");
    }
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
        return message.reply("❌ I do not have permission to kick members.");
    }
    const member = message.mentions.members?.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!member)
        return message.reply("⚠️ Please mention a valid member to kick.");
    if (message.member.roles.highest.position <= member.roles.highest.position && message.guild.ownerId !== message.author.id) {
        return message.reply("❌ You cannot kick someone with an equal or higher role.");
    }
    if (message.guild.members.me.roles.highest.position <= member.roles.highest.position) {
        return message.reply("❌ I cannot kick someone with an equal or higher role than me.");
    }
    const reason = args.slice(1).join(" ") || "No reason provided";
    await member.kick(reason);
    const embed = new EmbedBuilder()
        .setColor("#FF5555")
        .setTitle("👢 Member Kicked")
        .setDescription(`**${member.user.tag}** was kicked.\n**Reason:** ${reason}`)
        .setFooter({ text: `Kicked by ${message.author.tag}` })
        .setTimestamp();
    await message.channel.send({ embeds: [embed] });
}
