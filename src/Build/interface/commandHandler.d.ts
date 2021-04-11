export interface commandHandlerOptions {
    commandDirectory: string;
    prefix: string | string[] | Function;
    defaultCooldown?: number;
}
export declare const Events: {
    commandHandler: {
        COOLDOWN: string;
    };
};
