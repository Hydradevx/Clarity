import { ClarityClient } from "../utils/types";

export const name = "ping";

export async function execute(client: ClarityClient, message: any, args: string[]) {
  await message.channel.send(`🏓 Pong! Latency: ${client.ws.ping}ms`);
}