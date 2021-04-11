export interface CasanovaOptions {
  token: string;
  handlers: Array<"command" | "event">;
}

export class CasanovaError extends Error {
  date: Date;
  constructor(message: string) {
    super(message);

    Error.captureStackTrace(this, CasanovaError);

    this.name = "CasanovaError";
    this.message = message;
    // debugging
    this.date = new Date();
  }
}
