import { EmbedBuilder } from "discord.js";
import { getDueReminders, deleteReminder } from "../utils/db";
export function startReminderScheduler(client) {
    setInterval(async () => {
        const dueReminders = await getDueReminders();
        if (!dueReminders.length)
            return;
        for (const reminder of dueReminders) {
            const reminderId = reminder._id?.toString() || reminder.id?.toString();
            const channel = client.channels.cache.get(reminder.channel_id);
            if (!channel) {
                if (reminderId)
                    await deleteReminder(reminderId);
                continue;
            }
            const user = await client.users.fetch(reminder.user_id).catch(() => null);
            const embed = new EmbedBuilder()
                .setColor("#FFD700")
                .setAuthor({
                name: user ? `${user.username}'s Reminder` : "Reminder",
                iconURL: user?.displayAvatarURL() || undefined
            })
                .setTitle("<a:emoji_21:1401112155406991433> Reminder")
                .setDescription(reminder.message)
                .setFooter({
                text: user ? `Reminder for ${user.tag}` : `User ID: ${reminder.user_id}`,
                iconURL: user?.displayAvatarURL() || undefined
            })
                .setTimestamp();
            try {
                await channel.send({
                    content: `<@${reminder.user_id}>`,
                    embeds: [embed]
                });
                if (reminderId)
                    await deleteReminder(reminderId);
            }
            catch (err) {
                console.error(`Failed to send reminder ${reminderId}:`, err);
            }
        }
    }, 10_000);
}
