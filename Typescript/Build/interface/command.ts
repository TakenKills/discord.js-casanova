import { Message } from "discord.js";
import { CasanovaClient } from "../Client/client";

export interface commandOptions {
  name: string;
  usage?: string;
  description?: string;
  category?: string;
  cooldown?: number;
}

export interface Command {
  client: CasanovaClient;
  name: string;
  filePath: string;
  usage?: string;
  description?: string;
  category?: string;
  cooldown?: number;
  execute(message: Message, args: string[]): any;
}
