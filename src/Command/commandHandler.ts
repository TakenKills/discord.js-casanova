// @ts-ignore
import { EventEmitter } from "events";
import { commandHandlerOptions } from "../interface/commandHandler";
import { Command } from "../interface/command";
// @ts-ignore
import rread from "readdir-recursive";
// @ts-ignore
import { resolve } from "path";
import { CasanovaClient, throwErr } from "../Client/client";
import { Collection, Message, Snowflake } from "discord.js";
import { Events } from "../interface/commandHandler";
import { CommandBase } from "./command";
const { commandHandler: EVENTS } = Events;
const { fileSync } = new rread();

export class CommandHandler extends EventEmitter {
  commandDirectory: string;
  prefix: string | string[] | Function;
  client: CasanovaClient;

  readonly commands: Collection<string, Command>;
  readonly cooldowns: Collection<string, Collection<Snowflake, number>>;
  readonly aliases: Collection<string, string>;

  ignoreCooldown?: Array<Snowflake> | Snowflake;
  defaultCooldown?: number;
  strict?: boolean;
  baseClientPermissions?: string[];
  baseMemberPermissions?: string[];
  blockClient?: boolean;
  blockBots?: boolean;
  setCommandClient?: boolean;

  usedCategories: string[];

  constructor(
    client: CasanovaClient,
    CommandHandlerOptions: commandHandlerOptions
  ) {
    super();

    this.client = client;

    if (!client || !(client instanceof CasanovaClient))
      throwErr(
        `CommandHandler - The client passed into the commandHandler is not an instanceof CasanovaClient.`,
        "type"
      );

    if (!this.client.handlers.includes("command"))
      throwErr(
        'CommandHandler - "command" handler is not enabled via the client.',
        "range"
      );

    const {
      commandDirectory,
      prefix,
      defaultCooldown,
      ignoreCooldown,
      strict,
      baseClientPermissions,
      baseMemberPermissions,
      setCommandClient,
    } = CommandHandlerOptions;

    this.commandDirectory = commandDirectory;

    if (!this.commandDirectory || typeof this.commandDirectory !== "string")
      throwErr(
        `CommandHandler - There was no commandDirecotry provided to the commandHandler or it was not a typeof string.`,
        "range"
      );

    this.prefix = prefix;
    if (
      this.prefix &&
      !["string", "function"].includes(typeof this.prefix) &&
      !Array.isArray(typeof this.prefix)
    )
      throwErr(
        `CommandHandler - The prefix provided to the commandHandler is not a typeof string, function or array.`,
        "type"
      );

    this.baseClientPermissions = baseClientPermissions;

    if (
      this.baseClientPermissions &&
      !Array.isArray(this.baseClientPermissions)
    )
      throwErr(
        'CommandHandler - The "baseClientPermissions" option on the command handler is not an array.'
      );

    this.baseMemberPermissions = baseMemberPermissions;

    if (
      this.baseMemberPermissions &&
      !Array.isArray(this.baseMemberPermissions)
    )
      throwErr(
        'CommandHandler - The "baseMemberPermissions" option on the command handler is not an array.'
      );

    this.strict = strict;

    if (this.strict && typeof this.strict !== "boolean")
      throwErr(
        `CommandHandler - The "strict" option on the command handler is not a typeof boolean`
      );

    this.defaultCooldown = defaultCooldown;

    if (!this.defaultCooldown) this.defaultCooldown = 3;
    else if (typeof this.defaultCooldown !== "number")
      throwErr(
        `CommandHandler - The defaultCooldown option on the command handler is not a number.`,
        "type"
      );

    this.ignoreCooldown = ignoreCooldown;

    if (
      this.ignoreCooldown &&
      typeof this.ignoreCooldown !== "string" &&
      !Array.isArray(this.ignoreCooldown)
    )
      throwErr(
        `CommandHandler - The "ignoreCooldown" option on the command handler is not a string nor an array.`,
        "type"
      );

    this.setCommandClient = setCommandClient;

    if (this.setCommandClient && typeof this.setCommandClient !== "boolean")
      throwErr(
        'CommandHandler: The "setCommandClient" option is not a boolean. default is true.'
      );

    if (!this.setCommandClient) this.setCommandClient = true;

    this.commands = new Collection();

    this.cooldowns = new Collection();

    this.aliases = new Collection();

    this.usedCategories = new Array();

    for (const path of fileSync(resolve(this.commandDirectory)))
      this.loadCommand(path);

    this.client.on("message", (message: Message) => this.handle(message));
  }

  loadCommand(path: string): void {
    const File = require(path);
    const command: Command = new File(this.client);

    if (this.commands.has(command.name))
      throwErr(
        `CommandHandler - loadCommand - The command ${command.name} has already been loaded.`
      );

    if (!command.execute || typeof command.execute !== "function")
      throwErr(
        `CommandHandler - loadCommand - There was no execute function on the command "${command.name}"`
      );

    command.filePath = path;
    if (this.setCommandClient) command.client = this.client;

    this.commands.set(command.name, command);

    if (command.aliases)
      for (const alias of command.aliases)
        this.aliases.set(alias, command.name);

    if (command.category && !this.usedCategories.includes(command.category))
      this.usedCategories.push(command.category);
  }

  reloadCommand(name: string): void {
    const command = this.commands.get(name);

    if (!command)
      throwErr(
        `CommandHandler - reloadCommand - There was no command by that name or that command has not been loaded yet.`
      );

    try {
      // @ts-ignore
      delete require.cache[require.resolve(command?.filePath)];

      this.commands.delete(name);

      //@ts-ignore
      this.loadCommand(command?.filePath);
    } catch (e) {
      console.error(e);
    }
  }

  async handle(message: Message): Promise<void | boolean> {
    if (this.blockClient && message.author.id === this.client.user?.id) return;
    if (this.blockBots && message.author.bot) return;

    let prefix: string | string[] | Function = this.prefix;

    // @ts-ignore
    if (prefix instanceof Function) prefix = await this.prefix(message);

    if (Array.isArray(prefix)) {
      //@ts-ignore
      prefix = prefix.find((pre: string) => message.content.startsWith(pre));
    }

    if (!prefix) return;

    // @ts-ignore
    if (!message.content.startsWith(prefix)) return;

    const [commandName, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    let command =
      this.commands.get(commandName) ||
      //@ts-ignore
      this.commands.get(this.aliases?.get(commandName));

    if (this.strict)
      command =
        this.commands.get(commandName.toLowerCase()) ||
        // @ts-ignore
        this.commands.get(this.aliases?.get(commandName?.toLowerCase()));

    if (!command || !(command instanceof CommandBase)) return;
    //@ts-ignore
    console.log(message.channel.nsfw);

    if (command.nsfw && message.guild)
      return this.emit(EVENTS.COMMAND_BLOCKED, message, command, "nsfw");

    if (command.guildOnly && !message.guild)
      return this.emit(EVENTS.COMMAND_BLOCKED, message, command, "guildOnly");

    if (this.client.owners) {
      if (command.ownerOnly && !this.client.owners.includes(message.author.id))
        return this.emit(EVENTS.COMMAND_BLOCKED, message, command, "ownerOnly");
    } else
      console.error(
        "CasanovaError: You are unable to use the \"ownerOnly\" property on a command. Because you haven't set the owner id's inside the client"
      );

    if (command.clientPermissions) {
      //! Permissions

      const perms = new Array();

      perms.push(command.clientPermissions);
      if (this.baseClientPermissions) perms.concat(this.baseClientPermissions);

      let missing = new Array();

      for (const perm of perms)
        if (!message.guild?.me?.permissionsIn(message.channel).has(perm))
          missing.push(perm);

      if (missing[0])
        return this.emit(
          EVENTS.MISSING_PERMISSIONS,
          message,
          command,
          missing,
          "client"
        );
    }
    if (command.memberPermissions) {
      const perms = new Array();

      perms.push(command.memberPermissions);
      if (this.baseMemberPermissions) perms.concat(this.baseMemberPermissions);

      let missing = new Array();

      for (const perm of perms)
        if (!message.member?.permissionsIn(message.channel).has(perm))
          missing.push(perm);

      if (missing[0])
        return this.emit(
          EVENTS.MISSING_PERMISSIONS,
          message,
          command,
          missing,
          "member"
        );
    }

    //! Permissions

    //! Cooldown

    if (!this.cooldowns.has(command.name))
      this.cooldowns.set(command.name, new Collection());

    const now = Date.now();
    const timestamps = this.cooldowns.get(command.name);
    // @ts-ignore
    const cooldownAmount = (command.cooldown || this.defaultCooldown) * 1000;

    if (timestamps?.has(message.author.id)) {
      // @ts-ignore
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime && this.checkCooldown(message)) {
        const timeLeft = expirationTime - now;
        return this.emit(EVENTS.COOLDOWN, message, command, timeLeft);
      }
    }
    timestamps?.set(message.author.id, now);
    setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);

    //! Cooldown

    try {
      await command?.execute(message, args);
      return this.emit(EVENTS.COMMAND_USED, message, command);
    } catch (e) {
      console.error(e);
    }
  }

  private checkCooldown(message: Message): boolean {
    if (this.ignoreCooldown?.includes(message.author.id)) return false;
    return true;
  }
}
