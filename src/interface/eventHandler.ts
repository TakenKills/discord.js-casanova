import { Collection } from "discord.js";
import { CasanovaClient } from "../Client/client";
import { Event } from "./event";

export interface eventHandlerOptions {
  eventDirectory: string;
}

export interface EventHandler {
  client: CasanovaClient;
  eventDirectory: string;
  events: Collection<string, Event>;
  //! add used categories.
  loadEvent(path: string): void;
  handleEvent(eventName: string): void;
  reloadEvent(name: string): Promise<void>;
}
