import { ClarityClient } from "../utils/types";

export const name = "ready";
export const once = true;

export async function execute(client: ClarityClient) {
  console.log(`Logged in as ${client.user?.tag}`);
  client.user?.setActivity("Organizing your server");
}