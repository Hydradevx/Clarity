import { EmbedBuilder } from "discord.js";
import { Emojis } from "../../utils/emojiConfig.js";
export const name = "avatar";
export const description = "Shows the avatar of a user";
export async function execute(client, message, args) {
    const user = message.mentions.users.first() || message.author;
    const embed = new EmbedBuilder()
        .setColor("#00BFFF")
        .setTitle(`${Emojis.utility} ${user.username}'s Avatar`)
        .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
        .setTimestamp();
    await message.channel.send({ embeds: [embed] });
}
