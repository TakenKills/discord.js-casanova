"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBase = void 0;
const client_1 = require("../Client/client");
const constants_1 = require("../constants");
class EventBase {
    constructor(eventOptions) {
        const { name, once } = eventOptions;
        this.name = name;
        if (!this.name || typeof this.name !== "string")
            client_1.throwErr(`There was no name property provided in the super call of an event or the name provided was not a typeof string.`);
        if (!constants_1.events.includes(this.name))
            client_1.throwErr(`EventHandler: The event "${this.name}" is an invalid event.`);
        this.once = once;
        if (!this.once)
            this.once = false;
    }
}
exports.EventBase = EventBase;
