import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../utils/types";
import { getPrefix } from "../utils/db";

export const name = "help";
export const description = "Shows the help menu";

export async function execute(client: ClarityClient, message: any) {
  if (!message.guild) return;
  const prefix = await getPrefix(message.guild.id);

  const embed = new EmbedBuilder()
    .setColor("#4B9CD3")
    .setTitle("<:blue_crown:1387781705225736203> Welcome to Clarity <:blue_crown:1387781705225736203>")
    .setDescription(
      `**Explore all commands available to you**\n` +
      `**Use \`${prefix}help\` For More Details.**\n\n` +

      "**<:emoji_20:1401110003791827031>  Features**\n" +
      "<:emoji_23:1401121271609294899>  **General**\n" +
      "<:emoji_23:1401121271609294899>  **Management**\n" +
      "<:emoji_23:1401121271609294899>  **Utility**\n" +
      "<:emoji_23:1401121271609294899>  **Moderation**\n" +
      "<:emoji_23:1401121271609294899>  **Fun**\n\n" +

      "**🔗 Explore More**\n" +
      "<:emoji_22:1401113594879283220>  [**GitHub**](https://github.com/Hydradevx/Clarity) ・ 🎮 [**Join Us**](https://discord.gg/FkUDYSrw3d)\n\n" +

      "**Built by Hydra. Powered by HT. <:emoji_23:1401117260931797063>**\n" +
      "**Your Server’s Ultimate Assistant <:emoji_23:1401117260931797063>**"
    );

  await message.channel.send({ embeds: [embed] });
}