import { EmbedBuilder, TextChannel } from "discord.js";
import { getDueReminders, deleteReminder } from "../utils/db";
import { ClarityClient } from "../utils/types";

export function startReminderScheduler(client: ClarityClient) {
  setInterval(async () => {
    const dueReminders = await getDueReminders();
    if (!dueReminders.length) return;

    for (const reminder of dueReminders) {
      const channel = client.channels.cache.get(reminder.channel_id) as TextChannel;

      if (!channel) {
        await deleteReminder(reminder._id?.toString() || reminder.id?.toString());
        continue;
      }

      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("⏰ Reminder")
        .setDescription(reminder.message)
        .setFooter({ text: `Reminder for <@${reminder.user_id}>` })
        .setTimestamp();

      try {
        await channel.send({ content: `<@${reminder.user_id}>`, embeds: [embed] });
        await deleteReminder(reminder._id?.toString() || reminder.id?.toString());
      } catch (err) {
        console.error(`Failed to send reminder ${reminder._id || reminder.id}:`, err);
      }
    }
  }, 6_000); 
}