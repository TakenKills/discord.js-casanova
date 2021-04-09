import { Message } from "discord.js";
import { CasanovaClient } from "../Client/client";

export interface commandOptions {
  name: string;
}

export interface Command {
  client: CasanovaClient;
  name: string;
  filePath: string;
  execute(message: Message, args: string[]): void;
}
