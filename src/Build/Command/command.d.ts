import { commandOptions } from "../interface/command";
import { CasanovaClient } from "../Client/client";
export declare class CommandBase {
    name: string;
    client: CasanovaClient;
    filepath: string;
    constructor(commandOptions: commandOptions);
}
