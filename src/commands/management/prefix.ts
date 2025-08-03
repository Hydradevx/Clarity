import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
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
      .setTitle("<:emoji_36:1401088664683155549> Server Prefix")
      .setDescription(`**Current Prefix:** \`${currentPrefix}\``)
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }

  if (!isOwner && args.length > 0) {
    const embed = new EmbedBuilder()
      .setColor("#FF5555")
      .setTitle("🚫 Permission Denied")
      .setDescription("Only the **server owner** can change the prefix.")
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }

  if (args.length === 0) {
    const embed = new EmbedBuilder()
      .setColor("#00BFFF")
      .setTitle("<:emoji_36:1401088664683155549> Server Prefix")
      .setDescription(
        `**Current Prefix:** \`${currentPrefix}\`\n\n` +
        `Use the buttons below to **view** or **change** the prefix.`
      )
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("view_prefix")
        .setLabel("View Prefix")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("change_prefix")
        .setLabel("Change Prefix")
        .setStyle(ButtonStyle.Success)
    );

    const reply = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000
    });

    collector.on("collect", async (interaction: any) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: "You cannot use this button.", ephemeral: true });
      }

      if (interaction.customId === "view_prefix") {
        await interaction.reply({ content: `The current prefix is: \`${currentPrefix}\``, ephemeral: true });
      }

      if (interaction.customId === "change_prefix") {
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
          .setFooter({ text: `Changed by ${message.author.tag}` })
          .setTimestamp();

        return message.channel.send({ embeds: [successEmbed] });
      }
    });

    collector.on("end", () => {
      reply.edit({ components: [] });
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
    .setFooter({ text: `Changed by ${message.author.tag}` })
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
}1