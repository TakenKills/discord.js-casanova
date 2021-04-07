"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBase = void 0;
const client_1 = require("../Client/client");
class EventBase {
    constructor(eventOptions) {
        const { name } = eventOptions;
        this.name = name;
        if (!this.name || typeof this.name !== "string")
            client_1.throwErr(`There was no name property provided in the super call of an event or the name provided was not a typeof string.`);
    }
}
exports.EventBase = EventBase;
