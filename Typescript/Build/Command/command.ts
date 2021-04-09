import { commandOptions } from "../interface/command";
import { CasanovaClient, throwErr } from "../Client/client";
export class CommandBase {
  name: string;
  // @ts-ignore
  client: CasanovaClient;
  // @ts-ignore
  filepath: string;

  constructor(commandOptions: commandOptions) {
    const { name  } = commandOptions;

    this.name = name;
    if (!this.name || typeof this.name !== "string")
      throwErr(
        `There was no name property provided in the super call of a command or the name provided was not a typeof string.`
      );
  }
}
