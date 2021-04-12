import { CasanovaClient } from "../Client/client";
export interface eventOptions {
    name: string;
    once?: boolean;
}
export interface Event {
    name: string;
    once?: boolean;
    client: CasanovaClient;
    path: string;
    execute(...args: any): any;
}
