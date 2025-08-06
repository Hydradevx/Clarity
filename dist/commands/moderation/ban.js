import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
export const name = "ban";
export const description = "Ban a member from the server";
export async function execute(client, message, args) {
    if (!message.guild)
        return;
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return message.reply("❌ You do not have permission to ban members.");
    }
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
        return message.reply("❌ I do not have permission to ban members.");
    }
    const member = message.mentions.members?.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!member)
        return message.reply("⚠️ Please mention a valid member to ban.");
    if (message.member.roles.highest.position <= member.roles.highest.position && message.guild.ownerId !== message.author.id) {
        return message.reply("❌ You cannot ban someone with an equal or higher role.");
    }
    if (message.guild.members.me.roles.highest.position <= member.roles.highest.position) {
        return message.reply("❌ I cannot ban someone with an equal or higher role than me.");
    }
    const reason = args.slice(1).join(" ") || "No reason provided";
    await member.ban({ reason });
    const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("🔨 Member Banned")
        .setDescription(`**${member.user.tag}** was banned.\n**Reason:** ${reason}`)
        .setFooter({ text: `Banned by ${message.author.tag}` })
        .setTimestamp();
    await message.channel.send({ embeds: [embed] });
}
