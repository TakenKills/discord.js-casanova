import { eventOptions } from "../interface/event";
import { throwErr } from "../Client/client";
import { events as validEvents } from "../constants";

export class EventBase {
  name: string;
  emittedFrom?: "commandhandler" | "client";
  once?: boolean;

  constructor(eventOptions: eventOptions) {
    const { name, emittedFrom, once } = eventOptions;

    this.name = name;
    if (!this.name || typeof this.name !== "string")
      throwErr(
        `There was no name property provided in the super call of an event or the name provided was not a typeof string.`
      );

    if (!validEvents.includes(this.name))
      throwErr(`The event "${this.name}" is an invalid event.`);

    this.emittedFrom = emittedFrom;
    if (!this.emittedFrom) this.emittedFrom = "client";

    this.once = once;
    if (!this.once) this.once = false;
  }
}
