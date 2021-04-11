import { eventOptions } from "../interface/event";
export declare class EventBase {
    name: string;
    emittedFrom?: "commandhandler" | "client";
    once?: boolean;
    constructor(eventOptions: eventOptions);
}
