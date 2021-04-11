import { commandOptions } from "../interface/command";
import { CasanovaClient } from "../Client/client";
import { Util } from "./Util";
export declare class CommandBase {
    name: string;
    client?: CasanovaClient;
    filepath?: string;
    usage?: string;
    description?: string;
    category?: string;
    util: Util;
    cooldown?: number;
    constructor(commandOptions: commandOptions);
}
