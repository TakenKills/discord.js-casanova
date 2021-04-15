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
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<Snowflake, number>>;
  defaultCooldown?: number;
  ignoreCooldown?: Array<Snowflake> | Snowflake;
  aliases: Collection<string, string>;

  constructor(
    client: CasanovaClient,
    CommandHandlerOptions: commandHandlerOptions
  ) {
    super();

    this.client = client;

    if (!client || !(client instanceof CasanovaClient))
      throwErr(
        `CommandHandler - The client passed into the commandHandler is not an instanceof CasanovaClient.`,
        "syntax"
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
    } = CommandHandlerOptions;

    this.commandDirectory = commandDirectory;

    if (!this.commandDirectory || typeof this.commandDirectory !== "string")
      throwErr(
        `CommandHandler - There was no commandDirecotry provided to the commandHandler or it was not a typeof string.`,
        "range"
      );

    this.prefix = prefix;
    if (
      !this.prefix &&
      !["string", "function"].includes(typeof this.prefix) &&
      !Array.isArray(typeof this.prefix)
    )
      throwErr(
        `CommandHandler - The prefix provided to the commandHandler is not a typeof string, function or array.`,
        "type"
      );

    this.defaultCooldown = defaultCooldown;

    if (!this.defaultCooldown) this.defaultCooldown = 3;

    if (typeof this.defaultCooldown !== "number")
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

    this.commands = new Collection();

    this.cooldowns = new Collection();

    this.aliases = new Collection();

    const paths = fileSync(resolve(this.commandDirectory));

    for (const path of paths) this.loadCommand(path);

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
    command.client = this.client;

    this.commands.set(command.name, command);
    for (const alias of command.aliases) this.aliases.set(alias, command.name);
  }

  reloadCommand(name: string): void {
    const command = this.commands.get(name);

    if (!command)
      throwErr(
        `CommandHandler - reloadCommand - There was no command by that name`
      );

    try {
      // @ts-ignore
      delete require.cache[require.resolve(command?.filePath)];

      this.commands.delete(name);
      // @ts-ignore
      this.loadCommand(command?.filePath);
    } catch (e) {
      console.error(e);
    }
  }

  async handle(message: Message): Promise<void | boolean> {
    let prefix: string | string[] | Function = this.prefix;

    // @ts-ignore
    if (prefix instanceof Function) prefix = await this.prefix(message);

    // @ts-ignore
    if (!message.content.startsWith(prefix)) return;

    const command =
      // @ts-ignore
      this.commands.get(commandName.toLowerCase()) ||
      // @ts-ignore
      this.commands.get(this.aliases.get(commandName?.toLowerCase()));

    if (!command || !(command instanceof CommandBase)) return;

    if (!this.cooldowns.has(command.name))
      this.cooldowns.set(command.name, new Collection());

    const now = Date.now();
    const timestamps = this.cooldowns.get(command.name);
    // @ts-ignore
    const cooldownAmount = (command.cooldown || this.defaultCooldown) * 1000;

    if (timestamps?.has(message.author.id)) {
      // @ts-ignore
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = expirationTime - now;
        // @ts-ignore
        return this.emit(EVENTS.COOLDOWN, message, command, timeLeft);
      }
    }
    timestamps?.set(message.author.id, now);
    setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);

    const [commandName, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    try {
      return command?.execute(message, args);
    } catch (e) {
      console.error(e);
    }
  }
}
