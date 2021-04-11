"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const client_1 = require("../Client/client");
class Util {
    removeDuplicates(array) {
        if (Array.isArray(array))
            client_1.throwErr(`removeDuplicates: The "array" paramater passed is not an array.`);
        return [...new Set(array)];
    }
    capitalize(string) {
        if (typeof string !== "string")
            client_1.throwErr(`capitalize: The "string" paramater passed is not a typeof string.`);
        return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
    }
}
exports.Util = Util;
