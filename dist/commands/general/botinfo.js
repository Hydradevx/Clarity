import { EmbedBuilder } from "discord.js";
import { Emojis } from "../../utils/emojiConfig.js";
export const name = "botinfo";
export const description = "Displays information about Clarity bot";
export async function execute(client, message) {
    const embed = new EmbedBuilder()
        .setColor("#00FF7F")
        .setTitle(`${Emojis.general} Clarity Bot Info`)
        .setThumbnail(client.user?.displayAvatarURL() || "")
        .setDescription([
        `**Tag:** ${client.user?.tag}`,
        `**ID:** ${client.user?.id}`,
        `**Servers:** ${client.guilds.cache.size}`,
        `**Total Commands:** ${client.commands.size}`,
        ``,
        `**Support:** ${Emojis.github}[GitHub](https://github.com/Hydradevx/Clarity) ・ [Discord](https://discord.gg/FkUDYSrw3d)`
    ].join("\n"))
        .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
        .setTimestamp();
    await message.channel.send({ embeds: [embed] });
}
