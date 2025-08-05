import { Client, GatewayIntentBits, Collection } from "discord.js";
class ClarityClient extends Client {
    commands;
    constructor(options) {
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
