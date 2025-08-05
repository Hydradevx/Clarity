import { startReminderScheduler } from "../modules/remindScheduler.js";
import { ClarityClient } from "../utils/types.js";

export async function loadModules(client: ClarityClient) {
  startReminderScheduler(client);
}