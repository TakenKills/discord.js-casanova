export interface commandHandlerOptions {
  commandDirectory: string;
  prefix: string | string[] | Function;
  defaultCooldown?: number;
}

export const Events = {
  commandHandler: {
    COOLDOWN: "cooldown",
  },
};
