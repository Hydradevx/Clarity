import { EmbedBuilder } from "discord.js";
import { ClarityClient } from "../utils/types";
import { addReminder } from "../utils/db";

export const name = "remind";
export const description = "Sets a reminder";

function parseTime(input: string) {
  const match = input.match(/^(\d+)([smhd])$/i);
  if (!match) return null;
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return { duration: value * multipliers[unit], value, unit };
}

function humanFriendlyTime(value: number, unit: string) {
  const names: Record<string, string> = { s: "second", m: "minute", h: "hour", d: "day" };
  return `${value} ${names[unit]}${value > 1 ? "s" : ""}`;
}

export async function execute(client: ClarityClient, message: any, args: string[]) {
  if (!message.guild) return;
  if (args.length < 2) {
    return message.reply("Usage: `<time> <message>`\nExample: `10m Take a break`");
  }

  const timeStr = args.shift()!;
  const parsed = parseTime(timeStr);
  if (!parsed) return message.reply("Invalid time format. Use `s/m/h/d`.");

  const { duration, value, unit } = parsed;
  const remindAt = Date.now() + duration;
  const reminderMessage = args.join(" ");
  const friendlyTime = humanFriendlyTime(value, unit);

  await addReminder(message.guild.id, message.author.id, message.channel.id, reminderMessage, remindAt);

  const embed = new EmbedBuilder()
    .setColor("#FFD700")
    .setTitle("⏰ Reminder Set!")
    .setDescription(
      `**Your reminder has been created!**\n\n` +
      `⏳ **Time:** ${friendlyTime} *(<t:${Math.floor(remindAt / 1000)}:R>)*\n` +
      `💬 **Message:** ${reminderMessage}`
    )
    .setFooter({ text: `Reminder created by ${message.author.tag}` })
    .setTimestamp(remindAt);

  await message.channel.send({ embeds: [embed] });
}