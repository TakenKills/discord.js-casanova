import { CasanovaClient } from "../Client/client";
declare type EmittedFrom = "commandhandler" | "client";
export interface eventOptions {
    name: string;
    emittedFrom?: EmittedFrom;
    once?: boolean;
}
export interface Event {
    name: string;
    emittedFrom?: EmittedFrom;
    once?: boolean;
    client: CasanovaClient;
    execute(...args: any): any;
}
export {};
