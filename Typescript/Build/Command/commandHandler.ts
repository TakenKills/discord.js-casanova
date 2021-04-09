import { EventEmitter } from "events";
import { commandHandlerOptions } from "../interface/commandHandler";
import { Command } from "../interface/command";
// @ts-ignore
import rread from "readdir-recursive";
import { resolve } from "path";
import { CasanovaClient, throwErr } from "../Client/client";
import { Collection, Message, Snowflake } from "discord.js";
import { Events } from "../interface/commandHandler";
const { commandHandler: EVENTS } = Events;
const { fileSync } = new rread();

export class CommandHandler extends EventEmitter {
  commandDirectory: string;
  prefix: string | string[] | Function;
  client: CasanovaClient;
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<Snowflake, number>>;
  defaultCooldown?: number;

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

    if (!this.client.commandHandler)
      throwErr(
        "CommandHandler - The commandHandler option on the Casanova Client is not enabled.",
        "range"
      );

    const { commandDirectory, prefix, defaultCooldown } = CommandHandlerOptions;

    this.commandDirectory = commandDirectory;

    if (!this.commandDirectory || typeof this.commandDirectory !== "string")
      throwErr(
        `CommandHandler - There was no commandDirecotry provided to the commandHandler or it was not a typeof string.`
      );

    this.prefix = prefix;
    if (
      !this.prefix &&
      !["string", "function"].includes(typeof this.prefix) &&
      !Array.isArray(typeof this.prefix)
    )
      throwErr(
        `CommandHandler - The prefix provided to the commandHandler is not a typeof string, function or array.`
      );

    this.defaultCooldown = defaultCooldown;

    if (!this.defaultCooldown) this.defaultCooldown = 3;

    if (typeof this.defaultCooldown !== "number")
      throwErr(
        `CommandHandler - The defaultCooldown option on the command handler is not a number.`
      );

    this.commands = new Collection();

    this.cooldowns = new Collection();

    const paths = fileSync(resolve(this.commandDirectory));

    for (const path of paths) this.loadCommand(path);

    this.client.on(
      "message",
      (message: Message): Promise<void | boolean> => this.handle(message)
    );
  }

  loadCommand(path: string): void {
    const File = require(path);
    const command = new File(this.client);

    if (!command.execute || typeof command.execute !== "function")
      throwErr(
        `CommandHandler - loadCommand - There was no execute function on the command "${command.name}"`
      );

    command.filePath = path;
    command.client = this.client;

    this.commands.set(command.name, command);
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
      throw e;
    }
  }

  async handle(message: Message): Promise<void | boolean> {
    let prefix: string | string[] | Function = this.prefix;

    // @ts-ignore
    if (prefix instanceof Function) prefix = await this.prefix(message);

    // @ts-ignore
    if (!message.content.startsWith(prefix)) return;

    const [commandName, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    // @ts-ignore
    const command = this.commands.get(commandName?.toLowerCase());

    //! cooldown system doesn't work and i'm sleep deprived i'll fix later
    // @ts-ignore
    if (!this.cooldowns.has(command.name))
      // @ts-ignore
      this.cooldowns.set(command.name, new Collection());

    const now = Date.now();
    // @ts-ignore
    const timestamps = this.cooldowns.get(command.name);
    // @ts-ignore
    const cooldownAmount = (command?.cooldown || this.defaultCooldown) * 1000;

    // @ts-ignore
    if (timestamps.has(message.author.id)) {
      // @ts-ignore
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = expirationTime - now;
        return this.emit(EVENTS.COOLDOWN, message, command, timeLeft);
      }
    }

    try {
      return command?.execute(message, args);
    } catch (e) {
      throw e;
    }
  }
}
