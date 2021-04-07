import { eventOptions } from "../interface/event";
import { throwErr } from "../Client/client";

export class EventBase {
  name: string;
  constructor(eventOptions: eventOptions) {
    const { name } = eventOptions;

    this.name = name;
    if (!this.name || typeof this.name !== "string")
      throwErr(
        `There was no name property provided in the super call of an event or the name provided was not a typeof string.`
      );
  }
}