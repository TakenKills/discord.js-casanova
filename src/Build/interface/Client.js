"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasanovaError = void 0;
class CasanovaError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, CasanovaError);
        this.name = "CasanovaError";
        this.message = message;
        this.date = new Date();
    }
}
exports.CasanovaError = CasanovaError;
