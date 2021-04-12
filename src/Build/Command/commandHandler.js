"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const events_1 = require("events");
const readdir_recursive_1 = __importDefault(require("readdir-recursive"));
const path_1 = require("path");
const client_1 = require("../Client/client");
const discord_js_1 = require("discord.js");
const commandHandler_1 = require("../interface/commandHandler");
const command_1 = require("./command");
const { commandHandler: EVENTS } = commandHandler_1.Events;
const { fileSync } = new readdir_recursive_1.default();
class CommandHandler extends events_1.EventEmitter {
    constructor(client, CommandHandlerOptions) {
        super();
        this.client = client;
        if (!client || !(client instanceof client_1.CasanovaClient))
            client_1.throwErr(`CommandHandler - The client passed into the commandHandler is not an instanceof CasanovaClient.`, "syntax");
        if (!this.client.handlers.includes("command"))
            client_1.throwErr('CommandHandler - "command" handler is not enabled via the client.', "range");
        const { commandDirectory, prefix, defaultCooldown, ignoreCooldown, } = CommandHandlerOptions;
        this.commandDirectory = commandDirectory;
        if (!this.commandDirectory || typeof this.commandDirectory !== "string")
            client_1.throwErr(`CommandHandler - There was no commandDirecotry provided to the commandHandler or it was not a typeof string.`, "range");
        this.prefix = prefix;
        if (!this.prefix &&
            !["string", "function"].includes(typeof this.prefix) &&
            !Array.isArray(typeof this.prefix))
            client_1.throwErr(`CommandHandler - The prefix provided to the commandHandler is not a typeof string, function or array.`, "type");
        this.defaultCooldown = defaultCooldown;
        if (!this.defaultCooldown)
            this.defaultCooldown = 3;
        if (typeof this.defaultCooldown !== "number")
            client_1.throwErr(`CommandHandler - The defaultCooldown option on the command handler is not a number.`);
        this.ignoreCooldown = ignoreCooldown;
        if (this.ignoreCooldown &&
            typeof this.ignoreCooldown !== "string" &&
            !Array.isArray(this.ignoreCooldown))
            client_1.throwErr(`CommandHandler - `);
        this.commands = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        const paths = fileSync(path_1.resolve(this.commandDirectory));
        for (const path of paths)
            this.loadCommand(path);
        this.client.on("message", (message) => this.handle(message));
    }
    loadCommand(path) {
        const File = require(path);
        const command = new File(this.client);
        if (this.commands.has(command))
            client_1.throwErr(`CommandHandler - loadCommand - The command ${command.name} has already been loaded.`);
        if (!command.execute || typeof command.execute !== "function")
            client_1.throwErr(`CommandHandler - loadCommand - There was no execute function on the command "${command.name}"`);
        command.filePath = path;
        command.client = this.client;
        this.commands.set(command.name, command);
    }
    reloadCommand(name) {
        const command = this.commands.get(name);
        if (!command)
            client_1.throwErr(`CommandHandler - reloadCommand - There was no command by that name`);
        try {
            delete require.cache[require.resolve(command === null || command === void 0 ? void 0 : command.filePath)];
            this.commands.delete(name);
            this.loadCommand(command === null || command === void 0 ? void 0 : command.filePath);
        }
        catch (e) {
            console.error(e);
        }
    }
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let prefix = this.prefix;
            if (prefix instanceof Function)
                prefix = yield this.prefix(message);
            if (!message.content.startsWith(prefix))
                return;
            const [commandName, ...args] = message.content
                .slice(prefix.length)
                .trim()
                .split(/ +/g);
            const command = this.commands.get(commandName.toLowerCase());
            if (!command || !(command instanceof command_1.CommandBase))
                return;
            if (!this.cooldowns.has(command.name)) {
                this.cooldowns.set(command.name, new discord_js_1.Collection());
            }
            const now = Date.now();
            const timestamps = this.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || this.defaultCooldown) * 1000;
            if (timestamps === null || timestamps === void 0 ? void 0 : timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = expirationTime - now;
                    return this.emit(EVENTS.COOLDOWN, message, command, timeLeft);
                }
            }
            timestamps === null || timestamps === void 0 ? void 0 : timestamps.set(message.author.id, now);
            setTimeout(() => timestamps === null || timestamps === void 0 ? void 0 : timestamps.delete(message.author.id), cooldownAmount);
            try {
                return command === null || command === void 0 ? void 0 : command.execute(message, args);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.CommandHandler = CommandHandler;
