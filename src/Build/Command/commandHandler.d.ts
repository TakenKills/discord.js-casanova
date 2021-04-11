/// <reference types="node" />
import { EventEmitter } from "events";
import { commandHandlerOptions } from "../interface/commandHandler";
import { Command } from "../interface/command";
import { CasanovaClient } from "../Client/client";
import { Collection, Message, Snowflake } from "discord.js";
export declare class CommandHandler extends EventEmitter {
    commandDirectory: string;
    prefix: string | string[] | Function;
    client: CasanovaClient;
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<Snowflake, number>>;
    defaultCooldown?: number;
    constructor(client: CasanovaClient, CommandHandlerOptions: commandHandlerOptions);
    loadCommand(path: string): void;
    reloadCommand(name: string): void;
    handle(message: Message): Promise<void | boolean>;
}
