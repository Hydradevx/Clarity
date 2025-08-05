import { EmbedBuilder } from "discord.js";
import { Emojis } from "../../utils/emojiConfig.js";
export const name = "stats";
export const description = "Shows server statistics";
export async function execute(client, message) {
    if (!message.guild)
        return;
    const { guild } = message;
    const icon = guild.iconURL({ size: 1024, dynamic: true });
    const embed = new EmbedBuilder()
        .setColor("#00BFFF")
        .setAuthor({
        name: `${guild.name} — Server Stats`,
        iconURL: icon || undefined
    })
        .setDescription([
        `${Emojis.general} **Members:** ${guild.memberCount}`,
        `${Emojis.arrow} **Channels:** ${guild.channels.cache.size}`,
        `${Emojis.utility} **Roles:** ${guild.roles.cache.size}`,
        `${Emojis.server} **Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:D> ・ <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
    ].join("\n"))
        .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
        .setTimestamp();
    if (icon)
        embed.setThumbnail(icon);
    await message.channel.send({ embeds: [embed] });
}
