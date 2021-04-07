import { EventEmitter } from "events";
import { commandHandlerOptions } from "../interface/commandHandler";
import { Command } from "../interface/command";
// @ts-ignore
import rread from "readdir-recursive";
import { resolve } from "path";
import { CasanovaClient, throwErr } from "../Client/client";
import { Collection, Message } from "discord.js";
const { fileSync } = new rread();

export class CommandHandler extends EventEmitter {
  commandDirectory: string;
  prefix: string | string[] | Function;
  client: CasanovaClient;
  commands: Collection<string, Command>;

  constructor(
    client: CasanovaClient,
    CommandHandlerOptions: commandHandlerOptions
  ) {
    super();

    this.client = client;

    if (!client || !(client instanceof CasanovaClient))
      throwErr(
        `The client passed into the commandHandler is not an instanceof CasanovaClient.`,
        "syntax"
      );

    if (!this.client.commandHandler)
      throwErr(
        "The commandHandler option on the Casanova Client is not enabled.",
        "range"
      );

    const { commandDirectory, prefix } = CommandHandlerOptions;

    this.commandDirectory = commandDirectory;

    if (!this.commandDirectory || typeof this.commandDirectory !== "string")
      throwErr(
        `There was no commandDirecotry provided to the commandHandler or it was not a typeof string.`
      );

    this.prefix = prefix;
    if (
      !this.prefix &&
      !["string", "function"].includes(typeof this.prefix) &&
      !Array.isArray(typeof this.prefix)
    )
      throwErr(
        `The prefix provided to the commandHandler is not a typeof string, function or array.`
      );

    this.commands = new Collection<string, Command>();

    for (const path of fileSync(resolve(this.commandDirectory)))
      this.loadCommand(path);

    this.client.on("message", (message: Message) => this.handle(message));
  }

  loadCommand(path: string): void {
    const File = require(path);
    const command = new File(this.client);

    if (!command.execute || typeof command.execute !== "function")
      throwErr(
        `There was no execute function on the command "${command.name}"`
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
    // @ts-ignore
    delete require.cache[require.resolve(command?.filePath)];

    this.commands.delete(name);
    // @ts-ignore
    this.loadCommand(command?.filePath);
  }

  handle(message: Message): void {
    console.log("hi");
    const prefix = this.prefix;

    const [commandName, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    // @ts-ignore
    const command = this.commands.get(commandName?.toLowerCase());
    try {
      command?.execute(message, args);
    } catch (e) {
      throw e;
    }
  }
}
