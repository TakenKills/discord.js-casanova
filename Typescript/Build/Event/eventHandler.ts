import { eventHandlerOptions } from "../interface/eventHandler";
// @ts-ignore
import rread from "readdir-recursive";
import { resolve } from "path";
import { CasanovaClient, throwErr } from "../Client/client";
import { Collection } from "discord.js";
import { Event } from "../interface/event";
import { CommandHandler } from "../Command/commandHandler";
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
      throwErr(
        `EventHandler: There was no client provided to the EventHandler.`
      );

    if (!this.client.handlers.includes("event"))
      throwErr(`EventHandler: "event" handler is not enabled via the client.`);

    const { eventDirectory } = eventHandlerOptions;

    this.eventDirectory = eventDirectory;

    if (!this.eventDirectory || typeof this.eventDirectory !== "string")
      throwErr(
        `EventHandler: There was either no eventDirecotry provided to the EventHandler or it was not a typeof string.`
      );

    this.events = new Collection();

    const filePaths = fileSync(resolve(this.eventDirectory));

    for (const path of filePaths) this.loadEvent(path);
    this.events.forEach((event: Event) => this.handleEvent(event.name));
  }

  loadEvent(path: string): void {
    const File = require(path);

    const event = new File(this.client);

    if (!event.execute || typeof event.execute !== "function")
      throwErr(
        `EventHandler: There was no execute function on the event "${event.name}".`
      );

    event.client = this.client;
    this.events?.set(event.name, event);
  }

  handleEvent(eventName: string): void {
    const event = this.events.get(eventName);
    if (!event)
      throwErr(
        `EventHandler: Tried to load an event but there was no eventName provided.`
      );

    if (!event?.execute || typeof event.execute !== "function")
      throwErr(`There was no "execute" function on the event ${eventName}`);

    let emitter: "client" | "commandhandler";
    //TODO! make emittedFrom option go boom boom
    //@ts-ignore
    emitter = event?.emittedFrom;

    // @ts-ignore
    if (!["client", "commandhandler"].includes(emitter?.toLowerCase()))
      throwErr(
        `EventHandler: On the event "${event?.name}" the "emittedFrom" option is not set to "client" nor "commandhandler".`
      );

    const type = event?.once ? "once" : "on";

    if (emitter?.toLowerCase() === "commandhandler") {
      const eventHandler = Object.values(this.client).find(
        (value: any) => value instanceof CommandHandler
      );

      if (!eventHandler)
        throwErr(
          `EventHandler: Tried to handle the event "${eventName}" But the client provided doesn't have a commandHandler property.`
        );

      try {
        eventHandler[type](event?.name, (...args: any) =>
          event?.execute(...args)
        );
      } catch (e) {
        console.error(e);
      }
    }

    try {
      this.client[type](eventName, (...args: any) => event?.execute(...args));
    } catch (e) {
      console.error(e);
    }
  }
}
