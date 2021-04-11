"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBase = void 0;
const client_1 = require("../Client/client");
const Util_1 = require("./Util");
class CommandBase {
    constructor(commandOptions) {
        const { name, usage, description, category, cooldown } = commandOptions;
        this.name = name;
        if (!this.name || typeof this.name !== "string")
            client_1.throwErr(`There was no name property provided in the super call of a command or the name provided was not a typeof string.`, "range");
        this.usage = usage;
        if (!Check("string", this.usage) && this.usage)
            client_1.throwErr(`The usage on the command "${this.name}" is not a typeof string.`, "type");
        this.description = description;
        if (!Check("string", this.description) && this.description)
            client_1.throwErr(`The description on the command "${this.name}" is not a typeof string.`, "type");
        this.category = category;
        if (!Check("string", this.category) && this.category)
            client_1.throwErr(`The category on the command "${this.name}" is not a typeof string.`, "type");
        this.cooldown = cooldown;
        this.util = new Util_1.Util();
    }
}
exports.CommandBase = CommandBase;
const Check = (type, variable) => {
    if (typeof variable !== type)
        return false;
    return true;
};
