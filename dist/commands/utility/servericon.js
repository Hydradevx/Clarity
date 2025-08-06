import { EmbedBuilder } from "discord.js";
import { Emojis } from "../../utils/emojiConfig.js";
export const name = "servericon";
export const description = "Displays the server's icon";
export async function execute(client, message) {
    if (!message.guild)
        return;
    const icon = message.guild.iconURL({ size: 1024, dynamic: true });
    if (!icon)
        return message.reply("This server has no icon!");
    const embed = new EmbedBuilder()
        .setColor("#00BFFF")
        .setTitle(`${Emojis.utility} ${message.guild.name} Icon`)
        .setImage(icon)
        .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
        .setTimestamp();
    await message.channel.send({ embeds: [embed] });
}
