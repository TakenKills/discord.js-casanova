import { commandOptions } from "../interface/command";
import { CasanovaClient, throwErr } from "../Client/client";
import { Util } from "./Util";
import { Permissions } from "discord.js";

export class CommandBase {
  name: string;
  client!: CasanovaClient;
  filepath!: string;
  usage?: string;
  description?: string;
  category?: string;
  util: Util;
  cooldown?: number;
  aliases?: string[];
  clientPermissions?: string[];
  memberPermissions?: string[];
  ownerOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  disabled?: boolean;

  opts?: object;

  constructor(commandOptions: commandOptions, opts?: object) {
    const {
      name,
      usage,
      description,
      category,
      cooldown,
      aliases,
      clientPermissions,
      memberPermissions,
      ownerOnly,
      guildOnly,
      nsfw,
      disabled,
    } = commandOptions;

    this.opts = opts;

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

    if (this.category && !Check("string", this.category))
      throwErr(
        `The category on the command "${this.name}" is not a typeof string.`,
        "type"
      );

    this.disabled = disabled;

    if (this.disabled && !Check("boolean", this.disabled))
      throwErr(
        `Command ${this.name}: The "disabled" option on that command is not a boolean.`
      );

    this.cooldown = cooldown;

    if (!Check("number", this.cooldown) && this.cooldown)
      throwErr(
        `Command "${this.name}": on that command the "cooldown" option is not a number.`
      );

    this.aliases = aliases;

    if (!Array.isArray(this.aliases) && this.aliases)
      throwErr(
        `Command "${this.name}": The aliases on that command is not an array.`
      );

    this.ownerOnly = ownerOnly;

    if (this.ownerOnly && typeof this.ownerOnly !== "boolean")
      throwErr(
        `Command "${this.name}": The "ownerOnly" option is not a boolean.`
      );
    if (!this.ownerOnly) this.ownerOnly = false;

    this.guildOnly = guildOnly;

    if (this.guildOnly && typeof this.guildOnly !== "boolean")
      throwErr(
        `Command "${this.name}": The "guildOnly" option is not a boolean.`
      );
    if (!this.guildOnly) this.guildOnly = true;

    this.nsfw = nsfw;

    if (this.nsfw && typeof this.nsfw !== "boolean")
      throwErr(`Command "${this.name}": The "nsfw" option is not a boolean.`);
    if (!this.nsfw) this.nsfw = false;

    this.clientPermissions = clientPermissions;

    if (this.clientPermissions && !Array.isArray(this.clientPermissions))
      throwErr(
        `Command "${this.name}": The "clientPermissions" option is not an array.`
      );

    this.memberPermissions = memberPermissions;

    if (this.memberPermissions && !Array.isArray(this.memberPermissions))
      throwErr(
        `Command "${this.name}": The "memberPermissions" option is not an array.`
      );

    if (this.clientPermissions)
      for (const perm of this.clientPermissions)
        if (!Object.keys(Permissions.FLAGS).includes(perm))
          throwErr(
            `Command "${this.name}": The permission "${perm}" on the "clientPermissions" option on that command is not a valid permission.`
          );

    if (this.memberPermissions)
      for (const perm of this.memberPermissions)
        if (!Object.keys(Permissions.FLAGS).includes(perm))
          throwErr(
            `Command "${this.name}": The permission "${perm}" on the "memberPermissions" option on that command is not a valid permission.`
          );

    this.util = new Util();
  }
}

const Check = (type: string, variable: any): boolean => {
  if (typeof variable !== type) return false;
  return true;
};
