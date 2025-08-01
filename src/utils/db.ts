import Database from "better-sqlite3";

export interface Reminder {
  id: number;
  guild_id: string;
  user_id: string;
  channel_id: string;
  message: string;
  remind_at: number;
}

const db = new Database("clarity.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS guilds (
    guild_id TEXT PRIMARY KEY,
    prefix TEXT DEFAULT 'c!'
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS message_counts (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (guild_id, user_id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    message TEXT NOT NULL,
    remind_at INTEGER NOT NULL
  )
`).run();

export function getPrefix(guildId: string): string {
  const row = db.prepare(`SELECT prefix FROM guilds WHERE guild_id = ?`).get(guildId) as { prefix?: string };
  return row?.prefix ?? "c!";
}

export function setPrefix(guildId: string, prefix: string) {
  db.prepare(`
    INSERT INTO guilds (guild_id, prefix) VALUES (?, ?)
    ON CONFLICT(guild_id) DO UPDATE SET prefix=excluded.prefix
  `).run(guildId, prefix);
}

export function incrementMessageCount(guildId: string, userId: string) {
  db.prepare(`
    INSERT INTO message_counts (guild_id, user_id, count)
    VALUES (?, ?, 1)
    ON CONFLICT(guild_id, user_id) DO UPDATE SET count = count + 1
  `).run(guildId, userId);
}

export function getUserMessageCount(guildId: string, userId: string): number {
  const row = db.prepare(`
    SELECT count FROM message_counts
    WHERE guild_id = ? AND user_id = ?
  `).get(guildId, userId) as { count?: number };
  return row?.count ?? 0;
}

export function getTopUsers(guildId: string, limit = 5) {
  return db.prepare(`
    SELECT user_id, count 
    FROM message_counts
    WHERE guild_id = ?
    ORDER BY count DESC
    LIMIT ?
  `).all(guildId, limit) as { user_id: string; count: number }[];
}

export function addReminder(
  guildId: string,
  userId: string,
  channelId: string,
  message: string,
  remindAt: number
) {
  db.prepare(`
    INSERT INTO reminders (guild_id, user_id, channel_id, message, remind_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(guildId, userId, channelId, message, remindAt);
}

export function getDueReminders(): Reminder[] {
  return db.prepare(`
    SELECT * FROM reminders
    WHERE remind_at <= ?
  `).all(Date.now()) as Reminder[];
}

export function deleteReminder(id: number) {
  db.prepare(`DELETE FROM reminders WHERE id = ?`).run(id);
}