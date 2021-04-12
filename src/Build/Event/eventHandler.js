"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventHandler = void 0;
const readdir_recursive_1 = __importDefault(require("readdir-recursive"));
const path_1 = require("path");
const client_1 = require("../Client/client");
const discord_js_1 = require("discord.js");
const commandHandler_1 = require("../Command/commandHandler");
const constants_1 = require("../constants");
const { fileSync } = new readdir_recursive_1.default();
class eventHandler {
    constructor(client, eventHandlerOptions) {
        this.client = client;
        if (!this.client)
            client_1.throwErr(`EventHandler: There was no client provided to the EventHandler.`);
        if (!this.client.handlers.includes("event"))
            client_1.throwErr(`EventHandler: "event" handler is not enabled via the client.`);
        const { eventDirectory } = eventHandlerOptions;
        this.eventDirectory = eventDirectory;
        if (!this.eventDirectory || typeof this.eventDirectory !== "string")
            client_1.throwErr(`EventHandler: There was either no eventDirecotry provided to the EventHandler or it was not a typeof string.`);
        this.events = new discord_js_1.Collection();
        const filePaths = fileSync(path_1.resolve(this.eventDirectory));
        for (const path of filePaths)
            this.loadEvent(path);
        this.events.forEach((event) => this.handleEvent(event.name));
    }
    loadEvent(path) {
        var _a;
        const File = require(path);
        const event = new File(this.client);
        if (this.events.has(event === null || event === void 0 ? void 0 : event.name))
            client_1.throwErr(`The event "${event === null || event === void 0 ? void 0 : event.name}" has already been loaded.`);
        if (!event.execute || typeof event.execute !== "function")
            client_1.throwErr(`EventHandler: There was no execute function on the event "${event.name}".`);
        event.client = this.client;
        event.path = path;
        (_a = this.events) === null || _a === void 0 ? void 0 : _a.set(event.name, event);
    }
    handleEvent(eventName) {
        const event = this.events.get(eventName);
        if (!event)
            client_1.throwErr(`EventHandler: Tried to load an event but there was no eventName provided.`);
        if (!(event === null || event === void 0 ? void 0 : event.execute) || typeof event.execute !== "function")
            client_1.throwErr(`There was no "execute" function on the event ${eventName}`);
        let emitter = "client";
        if (constants_1.validCommandHandlerEvents.includes(event === null || event === void 0 ? void 0 : event.name))
            emitter = "commandhandler";
        const type = (event === null || event === void 0 ? void 0 : event.once) ? "once" : "on";
        if ((emitter === null || emitter === void 0 ? void 0 : emitter.toLowerCase()) === "commandhandler") {
            const eventHandler = Object.values(this.client).find((value) => value instanceof commandHandler_1.CommandHandler);
            if (!eventHandler)
                client_1.throwErr(`EventHandler: Tried to handle the event "${eventName}" But the client provided doesn't have a commandHandler property.`);
            try {
                eventHandler[type](event === null || event === void 0 ? void 0 : event.name, (...args) => event === null || event === void 0 ? void 0 : event.execute(...args));
            }
            catch (e) {
                console.error(e);
            }
        }
        try {
            this.client[type](eventName, (...args) => event === null || event === void 0 ? void 0 : event.execute(...args));
        }
        catch (e) {
            console.error(e);
        }
    }
    reloadEvent(name) {
        return new Promise((resolve, reject) => {
            const event = this.events.get(name);
            if (!event)
                client_1.throwErr(`EventHandler - reloadEvent: That is not an event.`);
            try {
                delete require.cache[require.resolve(event === null || event === void 0 ? void 0 : event.path)];
                this.events.delete(name);
                this.loadEvent(event === null || event === void 0 ? void 0 : event.path);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.eventHandler = eventHandler;
