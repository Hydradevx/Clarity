import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../utils/types";

export const name = "ping";

export async function execute(client: ClarityClient, message: any, args: string[]) {
  const embed = new EmbedBuilder()
    .setColor("#00BFFF")
    .setTitle("<:emoji_36:1401088664683155549> Pong!")
    .setDescription(`Latency: **${client.ws.ping}ms**`)
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}