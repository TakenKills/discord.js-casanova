import { eventOptions } from "../interface/event";
import { CasanovaClient, throwErr } from "../Client/client";
import { events as validEvents } from "../constants";

export class EventBase {
  name: string;
  once?: boolean;
  //@ts-ignore
  client: CasanovaClient;
  // @ts-ignore
  path: string;

  constructor(eventOptions: eventOptions) {
    const { name, once } = eventOptions;

    this.name = name;
    if (!this.name || typeof this.name !== "string")
      throwErr(
        `There was no name property provided in the super call of an event or the name provided was not a typeof string.`
      );

    if (!validEvents.includes(this.name))
      throwErr(`EventHandler: The event "${this.name}" is an invalid event.`);

    this.once = once;
    if (!this.once) this.once = false;
  }
}
