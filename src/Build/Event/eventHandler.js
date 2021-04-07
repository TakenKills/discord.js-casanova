"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventHandler = void 0;
const readdir_recursive_1 = __importDefault(require("readdir-recursive"));
const node_path_1 = require("node:path");
const client_1 = require("../Client/client");
const discord_js_1 = require("discord.js");
const { fileSync } = new readdir_recursive_1.default();
class eventHandler {
    constructor(client, eventHandlerOptions) {
        this.client = client;
        if (!this.client)
            client_1.throwErr(`There was no client provided to the EventHandler.`);
        const { eventDirectory } = eventHandlerOptions;
        this.eventDirectory = eventDirectory;
        if (!this.eventDirectory || typeof this.eventDirectory !== "string")
            client_1.throwErr(`There was either no eventDirecotry provided to the EventHandler or it was not a typeof string.`);
        this.events = new discord_js_1.Collection();
        const filePaths = fileSync(node_path_1.resolve(this.eventDirectory));
        for (const path of filePaths)
            this.loadEvent(path);
    }
    loadEvent(path) {
        const File = require(path);
        const event = new File(this.client);
        if (!event.execute || typeof event.execute !== "function")
            client_1.throwErr(`There was no execute function on the event "${event.name}".`);
        event.client = this.client;
        try {
            this.client.on(event.name, (...args) => event.execute(...args));
        }
        catch (e) {
            throw e;
        }
    }
}
exports.eventHandler = eventHandler;
