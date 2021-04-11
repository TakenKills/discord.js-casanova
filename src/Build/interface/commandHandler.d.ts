import { Snowflake } from "discord.js";
export interface commandHandlerOptions {
    commandDirectory: string;
    prefix: string | string[] | Function;
    defaultCooldown?: number;
    ignoreCooldown?: Array<Snowflake> | Snowflake;
}
export declare const Events: {
    commandHandler: {
        COOLDOWN: string;
    };
};
