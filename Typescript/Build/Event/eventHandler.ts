import { eventHandlerOptions } from "../interface/eventHandler";
// @ts-ignore
import rread from "readdir-recursive";
import { resolve } from "node:path";
import { CasanovaClient, throwErr } from "../Client/client";
import { Collection } from "discord.js";
import { Event } from "../interface/event";
const { fileSync } = new rread();

export class eventHandler {
  eventDirectory: string;
  client: CasanovaClient;
  events: Collection<string, Event>;
  constructor(
    client: CasanovaClient,
    eventHandlerOptions: eventHandlerOptions
  ) {
    this.client = client;

    if (!this.client)
      throwErr(`There was no client provided to the EventHandler.`);

    const { eventDirectory } = eventHandlerOptions;

    this.eventDirectory = eventDirectory;

    if (!this.eventDirectory || typeof this.eventDirectory !== "string")
      throwErr(
        `There was either no eventDirecotry provided to the EventHandler or it was not a typeof string.`
      );

    this.events = new Collection();

    const filePaths = fileSync(resolve(this.eventDirectory));

    for (const path of filePaths) this.loadEvent(path);
  }

  loadEvent(path: string): void {
    const File = require(path);

    const event = new File(this.client);

    if (!event.execute || typeof event.execute !== "function")
      throwErr(`There was no execute function on the event "${event.name}".`);

    event.client = this.client;

    try {
      this.client.on(event.name, (...args: any): void =>
        event.execute(...args)
      );
    } catch (e) {
      throw e;
    }
  }
}
