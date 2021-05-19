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
  opts?: object;
  execute(...args: any): any;
}
