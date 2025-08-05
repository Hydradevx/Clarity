import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType
} from "discord.js";
import { ClarityClient } from "../../utils/types.js";
import { Emojis } from "../../utils/emojiConfig.js";

export const name = "help";
export const description = "Displays all command categories";

export async function execute(client: ClarityClient, message: any) {
  if (!message.guild) return;

  const commands = (client as any).commands;
  const totalCommands = commands.size;

  const categories: Record<string, any[]> = {};
  for (const [, cmd] of commands) {
    const category = cmd.category || "General";
    if (!categories[category]) categories[category] = [];
    categories[category].push(cmd);
  }

  const categoryNames = Object.keys(categories).sort();

  const overview = categoryNames
    .map(
      (cat) =>
        `${getCategoryEmoji(cat)} **${cat}** `
    )
    .join("\n");

  const categoryOptions = categoryNames.map((cat) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(`${cat} (${categories[cat].length})`)
      .setDescription(`View ${categories[cat].length} commands`)
      .setEmoji(getCategoryEmoji(cat))
      .setValue(cat.toLowerCase())
  );

  const embed = new EmbedBuilder()
    .setColor("#00BFFF")
    .setAuthor({
      name: `Clarity Help Menu`,
      iconURL:
        "https://cdn.discordapp.com/emojis/1401112155406991433.gif?size=64&quality=lossless"
    })
    .setTitle(`${Emojis.bolt} Welcome to Clarity ${Emojis.bolt}`)
    .setDescription(
      `> **Explore all ${totalCommands} commands available!**\n\n` +
        `**Categories:**\n${overview}\n\n` +
        `**Support Links:**\n` +
        `${Emojis.github} [GitHub Repository](https://github.com/Hydradevx/Clarity)\n` +
        `🌐 [Discord Server](https://discord.gg/FkUDYSrw3d)`
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

  const row =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  const reply = await message.channel.send({
    embeds: [embed],
    components: [row]
  });

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time: 45_000
  });

  collector.on("collect", async (interaction: any) => {
    if (interaction.user.id !== message.author.id) {
      return interaction.reply({
        content: "You cannot use this menu.",
        ephemeral: true
      });
    }

    const selected = interaction.values[0];
    const selectedCategory = categoryNames.find(
      (cat) => cat.toLowerCase() === selected
    );
    if (!selectedCategory) return;

    const categoryCommands = categories[selectedCategory];
    const formattedCommands = categoryCommands
      .map(
        (cmd) =>
          `${getCategoryEmoji(cmd.category || "General")} **${cmd.name}** — ${
            cmd.description || "No description"
          }`
      )
      .join("\n");

    const categoryEmbed = new EmbedBuilder()
      .setColor("#FFD700")
      .setAuthor({
        name: `${selectedCategory} Commands`,
        iconURL:
          "https://cdn.discordapp.com/emojis/1401112155406991433.gif?size=64&quality=lossless"
      })
      .setDescription(formattedCommands || "_No commands in this category._")
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    await interaction.update({ embeds: [categoryEmbed], components: [] });
    collector.stop();
  });

  collector.on("end", async () => {
    if (reply.editable) {
      reply.edit({ components: [] }).catch(() => {});
    }
  });
}

function getCategoryEmoji(category: string): string {
  const key = category.toLowerCase();
  return Emojis[key] || "📂";
}