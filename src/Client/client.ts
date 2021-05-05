import { ClientOptions, Client, Snowflake } from "discord.js";
import { CasanovaOptions, CasanovaError } from "../interface/Client";

export class CasanovaClient extends Client {
  token: string;
  handlers: Array<"command" | "event">;
  owners: Snowflake[];

  constructor(
    { token, handlers, owners }: CasanovaOptions,
    DiscordJSOptions: ClientOptions
  ) {
    super(DiscordJSOptions);

    this.token = token;

    if (!this.token || typeof this.token !== "string")
      throwErr(
        "Client: There was either no token provided or the token provided was not a typeof string.",
        "range"
      );

    this.handlers = handlers;
    if (this.handlers && !Array.isArray(this.handlers))
      throwErr(`Client: The "handlers" option on the client is not an array.`);

    this.owners = owners;
    if (this.owners && !Array.isArray(this.owners))
      throwErr(`Client: the "owners" option on the client is not an array.`);
  }

  build(): Promise<void> {
    return new Promise((resolve, reject) => {
      super.login(this.token).catch(reject);
      this.once("ready", resolve);
    });
  }
}

export const throwErr = (error: string, type?: "range" | "syntax" | "type") => {
  if (!type) throw new CasanovaError(`${error}`);
  else {
    if (type === "syntax") throw new SyntaxError(`Casanova Error - ${error}`);
    else if (type === "range")
      throw new RangeError(`Casanova Error - ${error}`);
    else if (type === "type") throw new TypeError(`Casanova Error - ${error}`);
  }
};
