export const name = "messageCreate";
export const once = false;

export async function execute(client: any, message: any) {
  if (message.author.bot) return; 

  if (message.content === "ping") {
    await message.channel.send(` Pong! Latency: ${client.ws.ping}ms`);
  }
}