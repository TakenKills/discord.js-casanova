"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBase = void 0;
const client_1 = require("../Client/client");
class CommandBase {
    constructor(commandOptions) {
        const { name } = commandOptions;
        this.name = name;
        if (!this.name || typeof this.name !== "string")
            client_1.throwErr(`There was no name property provided in the super call of a command or the name provided was not a typeof string.`);
    }
}
exports.CommandBase = CommandBase;
