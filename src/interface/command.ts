import { Message } from "discord.js";
import { CasanovaClient } from "../Client/client";

export interface commandOptions {
  name: string;
  usage?: string;
  description?: string;
  category?: string;
  cooldown?: number;
  aliases?: string[];
  clientPermissions?: string[];
  memberPermissions?: string[];
  ownerOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  disabled: boolean;
}

export interface Command {
  execute(message: Message, args: string[]): any;
  client: CasanovaClient;
  name: string;
  filePath: string;
  usage?: string;
  description?: string;
  category?: string;
  cooldown?: number;
  aliases?: string[];
  clientPermissions?: string[];
  memberPermissions?: string[];
  ownerOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  disabled: boolean;
}
