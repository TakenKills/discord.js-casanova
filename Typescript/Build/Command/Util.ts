import { throwErr } from "../Client/client";

export class Util {
  removeDuplicates(array: any[]): any[] {
    if (Array.isArray(array))
      throwErr(
        `removeDuplicates: The "array" paramater passed is not an array.`
      );
    return [...new Set(array)];
  }

  capitalize(string: string): string {
    if (typeof string !== "string")
      throwErr(
        `capitalize: The "string" paramater passed is not a typeof string.`
      );

    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
  }
}
