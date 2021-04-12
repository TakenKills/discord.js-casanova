import { Collection } from "discord.js";
import { CasanovaClient } from "../..";
import { Event } from "./event";
export interface eventHandlerOptions {
    eventDirectory: string;
}
export interface EventHandler {
    client: CasanovaClient;
    eventDirectory: string;
    events: Collection<string, Event>;
    loadEvent(path: string): void;
    handleEvent(eventName: string): void;
    reloadEvent(name: string): Promise<void>;
}
