import { startReminderScheduler } from "../modules/remindScheduler.js";
export async function loadModules(client) {
    startReminderScheduler(client);
}
