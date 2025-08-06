import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../../utils/types.js";
import { Emojis } from "../../utils/emojiConfig.js";

export const name = "userinfo";
export const description = "Displays information about a user";

export async function execute(client: ClarityClient, message: any, args: string[]) {
  const member = message.mentions.members?.first() || message.member;
  if (!member) return message.reply("User not found!");

  const embed = new EmbedBuilder()
    .setColor("#00BFFF")
    .setTitle(`${Emojis.general} User Info — ${member.user.username}`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setDescription(
      [
        `**Tag:** ${member.user.tag}`,
        `**ID:** ${member.id}`,
        `**Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        `**Joined Server:** <t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`
      ].join("\n")
    )
    .setFooter({
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}