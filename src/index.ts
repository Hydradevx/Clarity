import { token } from "./utils/EnvHandler.js";
import { client } from "./structures/client.js";

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})

client.on('messageCreate', (message: any) => {
  if(message.content === "ping") {
    return message.channel.send(`Pong! Ping is ${client.ws.ping}ms`)
  }
})

client.login(token)