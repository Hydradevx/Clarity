import mongoose, { Schema, model } from "mongoose";
const guildSchema = new Schema({
    guild_id: { type: String, required: true, unique: true },
    prefix: { type: String, default: "c!" },
});
const messageCountSchema = new Schema({
    guild_id: { type: String, required: true },
    user_id: { type: String, required: true },
    count: { type: Number, default: 0 },
});
messageCountSchema.index({ guild_id: 1, user_id: 1 }, { unique: true });
const reminderSchema = new Schema({
    guild_id: { type: String, required: true },
    user_id: { type: String, required: true },
    channel_id: { type: String, required: true },
    message: { type: String, required: true },
    remind_at: { type: Number, required: true },
});
const Guild = model("Guild", guildSchema);
const MessageCount = model("MessageCount", messageCountSchema);
const ReminderModel = model("Reminder", reminderSchema);
export async function initDB() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected!');
}
export async function getPrefix(guildId) {
    const guild = await Guild.findOne({ guild_id: guildId }).lean();
    return guild?.prefix ?? "c!";
}
export async function setPrefix(guildId, prefix) {
    await Guild.findOneAndUpdate({ guild_id: guildId }, { prefix }, { upsert: true });
}
export async function incrementMessageCount(guildId, userId) {
    await MessageCount.findOneAndUpdate({ guild_id: guildId, user_id: userId }, { $inc: { count: 1 } }, { upsert: true, new: true });
}
export async function getUserMessageCount(guildId, userId) {
    const entry = await MessageCount.findOne({ guild_id: guildId, user_id: userId }).lean();
    return entry?.count ?? 0;
}
export async function getTopUsers(guildId, limit = 5) {
    return MessageCount.find({ guild_id: guildId })
        .sort({ count: -1 })
        .limit(limit)
        .lean();
}
export async function addReminder(guildId, userId, channelId, message, remindAt) {
    await ReminderModel.create({
        guild_id: guildId,
        user_id: userId,
        channel_id: channelId,
        message,
        remind_at: remindAt,
    });
}
export async function getDueReminders() {
    return ReminderModel.find({ remind_at: { $lte: Date.now() } }).lean();
}
export async function deleteReminder(id) {
    await ReminderModel.findByIdAndDelete(id);
}
