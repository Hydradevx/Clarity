import { EmbedBuilder } from "discord.js";
import { addReminder } from "../../utils/db.js";
import { Emojis } from "../../utils/emojiConfig.js";
export const name = "remind";
export const description = "Sets a reminder";
function parseTime(input) {
    const match = input.match(/^(\d+)([smhd])$/i);
    if (!match)
        return null;
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return { duration: value * multipliers[unit], value, unit };
}
function humanFriendlyTime(value, unit) {
    const names = { s: "second", m: "minute", h: "hour", d: "day" };
    return `${value} ${names[unit]}${value > 1 ? "s" : ""}`;
}
export async function execute(client, message, args) {
    if (!message.guild)
        return;
    if (args.length < 2) {
        return message.reply("Usage: `<time> <message>`\nExample: `10m Take a break`");
    }
    const timeStr = args.shift();
    const parsed = parseTime(timeStr);
    if (!parsed)
        return message.reply("Invalid time format. Use `s/m/h/d`.");
    const { duration, value, unit } = parsed;
    const remindAt = Date.now() + duration;
    const reminderMessage = args.join(" ");
    const friendlyTime = humanFriendlyTime(value, unit);
    await addReminder(message.guild.id, message.author.id, message.channel.id, reminderMessage, remindAt);
    const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setAuthor({
        name: `${message.author.username}'s Reminder`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
        .setTitle(`${Emojis.bolt} Reminder Set!`)
        .setDescription(`⏳ **Time:** ${friendlyTime} *(<t:${Math.floor(remindAt / 1000)}:R>)*\n` +
        `💬 **Message:** ${reminderMessage}`)
        .setFooter({
        text: `Reminder created by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
        .setTimestamp(remindAt);
    await message.channel.send({ embeds: [embed] });
}
