import {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType
} from "discord.js";
import { setPrefix, getPrefix } from "../../utils/db";
import { ClarityClient } from "../../utils/types";

export const name = "prefix";
export const aliases: string[] = [];

export async function execute(client: ClarityClient, message: any, args: string[]) {
  if (!message.guild) return;

  const isOwner = message.guild.ownerId === message.author.id;
  const currentPrefix = await getPrefix(message.guild.id);

  if (!isOwner && args.length === 0) {
    const embed = new EmbedBuilder()
      .setColor("#00BFFF")
      .setAuthor({
        name: "Server Prefix",
        iconURL: "https://cdn.discordapp.com/emojis/1401112155406991433.gif?size=48&quality=lossless"
      })
      .setDescription(`**Current Prefix:** \`${currentPrefix}\``)
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }

  if (!isOwner && args.length > 0) {
    const embed = new EmbedBuilder()
      .setColor("#FF5555")
      .setTitle("🚫 Permission Denied")
      .setDescription("Only the **server owner** can change the prefix.")
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }

  if (args.length === 0 && isOwner) {
    const embed = new EmbedBuilder()
      .setColor("#00BFFF")
      .setAuthor({
        name: "Server Prefix Settings",
        iconURL: "https://cdn.discordapp.com/emojis/1401112155406991433.gif?size=48&quality=lossless"
      })
      .setDescription(
        `**Current Prefix:** \`${currentPrefix}\`\n` +
        `Select an option below to **view** or **change** the prefix.`
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId("prefix_menu")
      .setPlaceholder("Choose an option")
      .addOptions([
        { label: "View Prefix", value: "view_prefix", emoji: "👁️" },
        { label: "Change Prefix", value: "change_prefix", emoji: "✏️" }
      ]);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    const reply = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 30_000
    });

    collector.on("collect", async (interaction: any) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: "You cannot use this menu.", ephemeral: true });
      }

      if (interaction.values[0] === "view_prefix") {
        await interaction.reply({ content: `The current prefix is: \`${currentPrefix}\``, ephemeral: true });
      }

      if (interaction.values[0] === "change_prefix") {
        await interaction.reply({ content: "Please type the new prefix in chat.", ephemeral: true });

        const filter = (m: any) => m.author.id === message.author.id;
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30_000 });

        if (collected.size === 0) {
          return message.channel.send("⏳ Time expired. Prefix not changed.");
        }

        const newPrefix = collected.first()!.content;
        if (newPrefix.length > 5) {
          return message.channel.send("⚠️ Prefix too long! (Max 5 characters)");
        }

        await setPrefix(message.guild.id, newPrefix);

        const successEmbed = new EmbedBuilder()
          .setColor("#00FF7F")
          .setTitle("✅ Prefix Updated")
          .setDescription(`New prefix is now: \`${newPrefix}\``)
          .setFooter({ text: `Changed by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTimestamp();

        return message.channel.send({ embeds: [successEmbed] });
      }

      collector.stop();
      await reply.edit({ components: [] });
    });

    collector.on("end", () => {
      reply.edit({ components: [] }).catch(() => {});
    });

    return;
  }

  const newPrefix = args[0];
  if (newPrefix.length > 5) {
    return message.channel.send("⚠️ Prefix too long! (Max 5 characters)");
  }

  await setPrefix(message.guild.id, newPrefix);

  const embed = new EmbedBuilder()
    .setColor("#00FF7F")
    .setTitle("✅ Prefix Updated")
    .setDescription(`New prefix is now: \`${newPrefix}\``)
    .setFooter({ text: `Changed by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
}