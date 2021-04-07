import { ClientOptions, Client } from "discord.js";
import { CasanovaOptions } from "../interface/Client";

export class CasanovaClient extends Client {
  token: string;
  commandHandler: boolean;
  eventHandler: boolean;

  constructor(
    CasanovaOptions: CasanovaOptions,
    DiscordJSOptions: ClientOptions
  ) {
    const { token, commandHandler, eventHandler } = CasanovaOptions;
    super(DiscordJSOptions);

    this.token = token;

    if (!this.token || typeof this.token !== "string")
      throwErr(
        "There was either no token provided or the typeof token was not a string."
      );

    this.commandHandler = commandHandler;

    if (!this.commandHandler || typeof this.commandHandler !== "boolean")
      throwErr(
        "There was either no commandHandler property provided in the super call of the casanova client or it was not a typeof boolean."
      );

    this.eventHandler = eventHandler;

    if (!this.eventHandler || typeof this.eventHandler !== "boolean")
      throwErr(
        "There was either no eventHandler property provided in the super call of the casanova client or it was not a typeof boolean."
      );
  }

  build(): Promise<void> {
    return new Promise((resolve, reject) => {
      super.login(this.token).catch(reject);
      this.once("ready", resolve);
    });
  }
}

export const throwErr = (error: string, type?: string) => {
  if (!type) throw new Error(`Casanova Error - ${error}`);
  else {
    if (type === "syntax") throw new SyntaxError(`Casanova Error - ${error}`);
    else if (type === "range")
      throw new RangeError(`Casanova Error - ${error}`);
    else if (type === "type") throw new TypeError(`Casanova Error - ${error}`);
  }
};
