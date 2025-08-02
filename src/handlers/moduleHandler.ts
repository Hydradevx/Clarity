import { startReminderScheduler } from "../modules/remindSchduler";
import { ClarityClient } from "../utils/types";

export async function loadModules(client: ClarityClient) {
  startReminderScheduler(client);
}