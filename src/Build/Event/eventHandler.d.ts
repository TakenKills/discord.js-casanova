import { eventHandlerOptions } from "../interface/eventHandler";
import { CasanovaClient } from "../Client/client";
import { Collection } from "discord.js";
import { Event } from "../interface/event";
export declare class eventHandler {
    eventDirectory: string;
    client: CasanovaClient;
    events: Collection<string, Event>;
    constructor(client: CasanovaClient, eventHandlerOptions: eventHandlerOptions);
    loadEvent(path: string): void;
    handleEvent(eventName: string): void;
    reloadEvent(name: string): Promise<void>;
}
