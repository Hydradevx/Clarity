import { Client, Collection } from "discord.js";

export interface ClarityClient extends Client {
  commands: Collection<string, any>;
}