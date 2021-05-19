import { eventHandlerOptions } from "../interface/eventHandler";
// @ts-ignore
import rread from "readdir-recursive";
import { resolve } from "path";
import { CasanovaClient, throwErr } from "../Client/client";
import { Collection } from "discord.js";
import { Event } from "../interface/event";
import { CommandHandler } from "../Command/commandHandler";
import { validCommandHandlerEvents } from "../constants";
import EventEmitter from "events";
const { fileSync } = new rread();
const { Events: { commandHandler: EVENTS} } = require("../interface/commandHandler");

export class eventHandler extends EventEmitter {
  eventDirectory: string;
  client: CasanovaClient;
  events: Collection<string, Event>;

  opts?: object;

  constructor(
    client: CasanovaClient,
    eventHandlerOptions: eventHandlerOptions,
    opts?: object,
  ) {
    super();
    this.client = client;

    this.opts = opts;

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

    if (this.events.has(event?.name))
      throwErr(`The event "${event?.name}" has already been loaded.`);

    if (!event.execute || typeof event.execute !== "function")
      throwErr(
        `EventHandler: There was no execute function on the event "${event.name}".`
      );

    event.client = this.client;
    event.path = path;

    this.events?.set(event.name, event);
  }

  handleEvent(eventName: string): void|boolean {
    const event = this.events.get(eventName);
    if (!event)
      throwErr(
        `EventHandler: Tried to load an event but there was no eventName provided.`
      );

    if (!event?.execute || typeof event.execute !== "function")
      throwErr(`There was no "execute" function on the event ${eventName}`);

    let emitter: string = "client";
    // @ts-ignore
    if (validCommandHandlerEvents.includes(event?.name))
      emitter = "commandhandler";
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
      return this.emit(EVENTS.EVENT_ERROR, event, e)
    }
  }

  reloadEvent(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const event = this.events.get(name);
      if (!event) throwErr(`EventHandler - reloadEvent: That is not an event.`);
      try {
        //@ts-ignore
        delete require.cache[require.resolve(event?.path)];

        this.events.delete(name);
        //@ts-ignore
        this.loadEvent(event?.path);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
