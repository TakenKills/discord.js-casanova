import { CasanovaClient } from "../Client/client";
export interface eventOptions {
    name: string;
}
export interface Event {
    name: string;
    client: CasanovaClient;
}
