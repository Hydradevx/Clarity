import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Emojis } from "../../utils/emojiConfig.js";
export const name = "unban";
export const description = "Unbans a user by their ID";
export async function execute(client, message, args) {
    if (!message.guild)
        return;
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers))
        return message.reply("❌ You don't have permission to unban members.");
    const userId = args[0];
    if (!userId)
        return message.reply("Please provide a user ID to unban.");
    try {
        const unbannedUser = await message.guild.bans.remove(userId);
        const embed = new EmbedBuilder()
            .setColor("#00FF7F")
            .setTitle(`${Emojis.moderation} Member Unbanned`)
            .setDescription(`✅ **${unbannedUser.tag}** has been unbanned.`)
            .setFooter({
            text: `Unbanned by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
            .setTimestamp();
        await message.channel.send({ embeds: [embed] });
    }
    catch {
        message.reply("❌ Could not unban that user. Check the ID and try again.");
    }
}
