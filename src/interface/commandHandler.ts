import { Snowflake } from "discord.js";

export interface commandHandlerOptions {
  commandDirectory: string;
  prefix: string | string[] | Function;
  defaultCooldown?: number;
  ignoreCooldown?: Array<Snowflake> | Snowflake;
  strict?: boolean;
  blockClient?: boolean;
  blockBots?: boolean;
  setCommandClient?: boolean;
  baseClientPermissions?: string[];
  baseMemberPermissions?: string[];
}

export const Events = {
  commandHandler: {
    COOLDOWN: "cooldown", // (message, command, timeLeft)
    COMMAND_USED: "commandUsed", // (message, command)
    MISSING_PERMISSIONS: "missingPermissions", // (message, command, missingPerms, type)
    COMMAND_BLOCKED: "commandBlocked", // (message, command, reason)
    COMMAND_ERROR: "commandError", // (message, command, error)
    EVENT_ERROR: "eventError", // (message, event, error)
  },
};
