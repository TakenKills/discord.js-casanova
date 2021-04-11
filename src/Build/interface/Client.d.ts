export interface CasanovaOptions {
    token: string;
    handlers: Array<"command" | "event">;
}
export declare class CasanovaError extends Error {
    date: Date;
    constructor(message: string);
}
