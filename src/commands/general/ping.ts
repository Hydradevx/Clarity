import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../../utils/types";

export const name = "ping";

export async function execute(client: ClarityClient, message: any, args: string[]) {
  const embed = new EmbedBuilder()
    .setColor("#00BFFF")
    .setAuthor({
      name: `Pong! Latency: ${client.ws.ping}ms`,
      iconURL: "https://cdn.discordapp.com/emojis/1401112155406991433.gif?size=48&quality=lossless" // Animated icon
    })
    .setDescription(
      `🏓 **WebSocket Latency:** \`${client.ws.ping}ms\`\n` +
      `🖥️ **Shard:** \`${client.shard?.ids[0] ?? 0}\``
    )
    .setFooter({
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}