import { ClientOptions, Client } from "discord.js";
import { CasanovaOptions } from "../interface/Client";
export declare class CasanovaClient extends Client {
    token: string;
    commandHandler: boolean;
    eventHandler: boolean;
    constructor(CasanovaOptions: CasanovaOptions, DiscordJSOptions: ClientOptions);
    build(): Promise<void>;
}
export declare const throwErr: (error: string, type?: string | undefined) => void;
