"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwErr = exports.CasanovaClient = void 0;
const discord_js_1 = require("discord.js");
const Client_1 = require("../interface/Client");
class CasanovaClient extends discord_js_1.Client {
    constructor(CasanovaOptions, DiscordJSOptions) {
        const { token, handlers } = CasanovaOptions;
        super(DiscordJSOptions);
        this.token = token;
        if (!this.token || typeof this.token !== "string")
            exports.throwErr("CasanovaClient: There was either no token provided or the token provided was not a typeof string.", "range");
        this.handlers = handlers;
        if (!Array.isArray(this.handlers))
            exports.throwErr(`The "handlers" option on the client is not an array.`);
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
        throw new Client_1.CasanovaError(`${error}`);
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
