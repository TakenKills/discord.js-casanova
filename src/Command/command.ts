import { commandOptions } from "../interface/command";
import { CasanovaClient, throwErr } from "../Client/client";
import { Util } from "./Util";
export class CommandBase {
  name: string;
  client?: CasanovaClient;
  filepath?: string;
  usage?: string;
  description?: string;
  category?: string;
  util: Util;
  cooldown?: number;
  aliases: string[];

  constructor(commandOptions: commandOptions) {
    const { name, usage, description, category, cooldown, aliases } = commandOptions;

    this.name = name;
    if (!this.name || typeof this.name !== "string")
      throwErr(
        `There was no name property provided in the super call of a command or the name provided was not a typeof string.`,
        "range"
      );

    this.usage = usage;

    if (!Check("string", this.usage) && this.usage)
      throwErr(
        `The usage on the command "${this.name}" is not a typeof string.`,
        "type"
      );

    this.description = description;

    if (!Check("string", this.description) && this.description)
      throwErr(
        `The description on the command "${this.name}" is not a typeof string.`,
        "type"
      );

    this.category = category;

    if (!Check("string", this.category) && this.category)
      throwErr(
        `The category on the command "${this.name}" is not a typeof string.`,
        "type"
      );

    this.cooldown = cooldown;

        if (!Check("number", this.cooldown) && this.cooldown)
        throwErr(`Command "${this.name}": on that command the "cooldown" option is not a number.`)

    this.aliases = aliases;

    if (!Array.isArray(this.aliases) && this.aliases)
      throwErr(
        `Command "${this.name}": The aliases on that command is not an array.`
      );

    this.util = new Util();
  }
}

const Check = (type: string, variable: any): boolean => {
  if (typeof variable !== type) return false;
  return true;
};
