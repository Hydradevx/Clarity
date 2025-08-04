import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType
} from "discord.js";
import { ClarityClient } from "../../utils/types";
import { Emojis } from "../../utils/emojiConfig";

export const name = "help";
export const description = "Displays all command categories";

export async function execute(client: ClarityClient, message: any) {
  if (!message.guild) return;

  const commands = (client as any).commands;
  const totalCommands = commands.size;

  const categories: Record<string, any[]> = {};
  for (const [cmdName, cmd] of commands) {
    const category = cmd.category || "General";
    if (!categories[category]) categories[category] = [];
    categories[category].push(cmd);
  }

  const categoryOptions = Object.keys(categories).map((cat) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(cat)
      .setDescription(`View ${categories[cat].length} commands in ${cat}`)
      .setEmoji(getCategoryEmoji(cat))
      .setValue(cat.toLowerCase())
  );

  const embed = new EmbedBuilder()
    .setColor("#00BFFF")
    .setAuthor({
      name: `Clarity Help Menu`,
      iconURL: "https://cdn.discordapp.com/emojis/1401112155406991433.gif?size=64&quality=lossless"
    })
    .setTitle(`${Emojis.bolt} Welcome to Clarity ${Emojis.bolt}`)
    .setDescription(
      `> **Explore all ${totalCommands} commands available!**\n` +
      `> Use the dropdown below to view commands by category.\n\n` +
      `**Support:** ${Emojis.github}[GitHub](https://github.com/Hydradevx/Clarity) ・ [Discord](https://discord.gg/FkUDYSrw3d)`
    )
    .setFooter({
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("help_menu")
    .setPlaceholder("Choose a command category")
    .addOptions(categoryOptions);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  const reply = await message.channel.send({ embeds: [embed], components: [row] });

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time: 45_000
  });

  collector.on("collect", async (interaction: any) => {
    if (interaction.user.id !== message.author.id) {
      return interaction.reply({ content: "You cannot use this menu.", ephemeral: true });
    }

    const selected = interaction.values[0];
    const selectedCategory = Object.keys(categories).find(
      (cat) => cat.toLowerCase() === selected
    );
    if (!selectedCategory) return;

    const categoryCommands = categories[selectedCategory];
    const formattedCommands = categoryCommands
      .map((cmd) => `\`${cmd.name}\` - ${cmd.description || "No description"}`)
      .join("\n");

    const categoryEmbed = new EmbedBuilder()
      .setColor("#FFD700")
      .setAuthor({
        name: `${selectedCategory} Commands`,
        iconURL: "https://cdn.discordapp.com/emojis/1401112155406991433.gif?size=64&quality=lossless"
      })
      .setDescription(formattedCommands || "No commands in this category.")
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    await interaction.update({ embeds: [categoryEmbed], components: [] });
    collector.stop();
  });

  collector.on("end", () => {
    if (!reply.editable) return;
    reply.edit({ components: [] }).catch(() => {});
  });
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    Utility: `${Emojis.utility}`,
    Management: `${Emojis.management}`,
    Moderation: `${Emojis.moderation}`,
    Fun: `${Emojis.fun}`,
    General: `${Emojis.general}`
  };
  return map[category] || "📂";
}