import { Client, GatewayIntentBits, Collection, ClientOptions } from "discord.js";

class ClarityClient extends Client {
  commands: Collection<string, any>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}

const client = new ClarityClient({
  intents: [
    GatewayIntentBits.Guilds,               
    GatewayIntentBits.GuildMessages,        
    GatewayIntentBits.MessageContent        
  ]
});

export { client };