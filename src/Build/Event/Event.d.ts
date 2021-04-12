import { eventOptions } from "../interface/event";
import { CasanovaClient } from "../Client/client";
export declare class EventBase {
    name: string;
    once?: boolean;
    client: CasanovaClient;
    path: string;
    constructor(eventOptions: eventOptions);
}
