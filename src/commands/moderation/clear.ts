import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { ClarityClient } from "../../utils/types.js";
import { Emojis } from "../../utils/emojiConfig.js";

export const name = "clear";
export const description = "Deletes a specified number of messages";

export async function execute(client: ClarityClient, message: any, args: string[]) {
  if (!message.guild) return;
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages))
    return message.reply("❌ You don't have permission to delete messages.");

  const amount = parseInt(args[0]);
  if (isNaN(amount) || amount < 1 || amount > 100)
    return message.reply("Please provide a number between **1** and **100**.");

  await message.channel.bulkDelete(amount, true);

  const embed = new EmbedBuilder()
    .setColor("#FFD700")
    .setTitle(`${Emojis.moderation} Messages Cleared`)
    .setDescription(`🧹 Successfully deleted **${amount}** messages.`)
    .setFooter({
      text: `Cleared by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  const msg = await message.channel.send({ embeds: [embed] });
  setTimeout(() => msg.delete().catch(() => {}), 5000);
}