"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwErr = exports.CasanovaClient = void 0;
const discord_js_1 = require("discord.js");
class CasanovaClient extends discord_js_1.Client {
    constructor(CasanovaOptions, DiscordJSOptions) {
        const { token, commandHandler, eventHandler } = CasanovaOptions;
        super(DiscordJSOptions);
        this.token = token;
        if (!this.token || typeof this.token !== "string")
            exports.throwErr("There was either no token provided or the typeof token was not a string.");
        this.commandHandler = commandHandler;
        if (!this.commandHandler || typeof this.commandHandler !== "boolean")
            exports.throwErr("There was either no commandHandler property provided in the super call of the casanova client or it was not a typeof boolean.");
        this.eventHandler = eventHandler;
        if (!this.eventHandler || typeof this.eventHandler !== "boolean")
            exports.throwErr("There was either no eventHandler property provided in the super call of the casanova client or it was not a typeof boolean.");
    }
    build() {
        return new Promise((resolve, reject) => {
            super.login(this.token).catch(reject);
            this.once("ready", resolve);
        });
    }
}
exports.CasanovaClient = CasanovaClient;
const throwErr = (error, type) => {
    if (!type)
        throw new Error(`Casanova Error - ${error}`);
    else {
        if (type === "syntax")
            throw new SyntaxError(`Casanova Error - ${error}`);
        else if (type === "range")
            throw new RangeError(`Casanova Error - ${error}`);
        else if (type === "type")
            throw new TypeError(`Casanova Error - ${error}`);
    }
};
exports.throwErr = throwErr;
