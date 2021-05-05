<div align="center">
  <br />
  <p>
    <a href="https://www.npmjs.com/package/discord-js-casanova"><img src="https://img.shields.io/npm/v/discord.js-casanova.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/discord.js-casanova"><img src="https://img.shields.io/npm/dt/discord.js-casanova.svg" alt="NPM Downloads" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord.js-casanova/"><img src="https://nodei.co/npm/discord.js-casanova.png?downloads=true" alt="NPM Install Info" /></a>
  </p>
</div>

**NOTE: If you're using typescript with this package and having problems please join the [support server](https://discord.gg/b2ScJAYRGp)**

## Features

#### Completely modular commands, and events.

    - Reading files recursively from directories.
    - Handle commands and events easily.

### Command Features.

  - Cooldowns! (In seconds).
  - Utility Functions!
  - Aliases!
  - Client and Member permissions!
  - Guild, and owner only commands!
  - Nsfw commands!

#### Command Handler Feautres.

 - prefix - can be a string, an array, or a function!
 - defaultCooldown - The default cooldown for commands! `optional`.
 - ignoreCooldown - Let specific users bypass the cooldown on commands! `optional`.
 - strict - Weather or not to be strict on command execution `optional` | `default=false`.
 - Base Client, and Member permissions. -  Check base permissions for each client and member. `optional`.

#### Command Handler Events.

  - cooldown - Emitted when a user is on cooldown.
  - commandUsed - Emitted when a user uses a command.
  - missingPermissions - Emitted when the member or client is missing permissions.
  - commandBlocked - emitted when a command is blocked due to `nsfw | ownerOnly | guildOnly`.

### Command Handler Event paramaters
  **`Note: command is the used command.
           message: is the Message object.`**
  - cooldown(message, command, timeLeft) *note: timeLeft is in milliseconds.*
  - commandUsed(message, command).
  - missingPermissions(message, command, missing, type) *note: `missing` are the missing permissions and `type` is either client or member.*
  - commandBlocked(message, command, reason) *note: reason being "nsfw OR guildOnly OR ownerOnly"*


 ## Getting Started!

  #### The Client
  ```js
    // First we import the Client from discord.js-casanova.
    
    const { CasanovaClient } = require("discord.js-casanova");
    
    // Then we create our client!
    
    class Client extends CasanovaClient {
      // constructor
      constructor() {
          // super call
            super({
                // here are the Casanova Client options.
                token: "Your bot token here.",
                handlers: ["command", "event"], // this option just enables the command and event handlers if you want to use only the command handler you can just put command in the array.
                owners: [""] // The owner IDS NOTE: Required if you want to use the ownerOnly command option.
            }, {
                 // Here goes your regular discord.js client options
              })
        }
         // This is a function to log the bot in.
        async start() {
          try {
              await this.build();
              return console.log(`${this.user.tag} is online!`);
            } catch (e) {
                 console.error(e);
            }
        }
    }
    
    // Now that we've created our client let's log the bot in!
    
    const client = new Client();
    
    client.start();
    
    // Now you're bot is online!
  ```
  
  #### Setting up the command handler.
  
  Well now that we've created our client let's set up the command handler.
  
  ```js
  // First let's import The command handler from discord.js-casanova!

const { CasanovaClient, CommandHandler } = require("discord.js-casanova");

class Client extends CasanovaClient {
  constructor() {
    super(
      {
        token: "Your bot token here.",
        handlers: ["command", "event"],
        owners: [""],
      },
      {}
    );

    // Then inside the clients constructor create a property and name it whatever you want in this example I'm naming it "commandHandler".
    this.commandHandler = new CommandHandler(this, {
      commandDirectory:
        "The command folder directory the base being the main directory.",
      prefix: (message) => {
        return "+"; // Notice this function MUST return a string!
      }, // here is your prefix note this can be a string, array, or a function
      baseClientPermissions: ["Base client permissions."],
      baseMemberPermissions: ["Base member permissions."],
      blockBots: true, // weather or not to block bots.
      blockClient: true, // Weather or not to block the client.
      defaultCooldown: 3, // The default cooldown for commands.
      ignoreCooldown: [""], // Array of people who can ignore the cooldown.
      setCommandClient: true, // default to true || This is mostly for typescript users if you set this to false you won't be able to access the client via `this.client`!
      strict: true, // default to false. Weather to be strict about the command's execution.
    });
  }

  async start() {
    try {
      await this.build();
      return console.log(`${this.user.tag} is online!`);
    } catch (e) {
      console.error(e);
    }
  }
}
```

#### Setting up the event handler!

```js
// Now for the event handler we have to import it first!
const {
  CasanovaClient,
  CommandHandler,
  EventHandler,
} = require("discord.js-casanova");

class Client extends CasanovaClient {
  constructor() {
    super(
      {
        token: "Your bot token here.",
        handlers: ["command", "event"],
        owners: [""],
      },
      {}
    );

    this.commandHandler = new CommandHandler(this, {
      commandDirectory:
        "The command folder directory the base being the main directory.",
      prefix: (message) => {
        return "+";
      },
      baseClientPermissions: ["Base client permissions."],
      baseMemberPermissions: ["Base member permissions."],
      blockBots: true,
      blockClient: true,
      defaultCooldown: 3,
      ignoreCooldown: [""],
      setCommandClient: true,
      strict: true,
    });

    // Then we make a property again call it whatever you want but i'm calling it eventHandler for this example.
    this.eventHandler = new EventHandler(this, {
      eventDirectory:
        "The event folder directory the base being the main directory.",
    });
  }

  async start() {
    try {
      await this.build();
      return console.log(`${this.user.tag} is online!`);
    } catch (e) {
      console.error(e);
    }
  }
}
```

#### Creating your first command!

Notice: This should be in each file in the commands directory.

```js
// Now for your first command!

// first we've gotta import the command base!

const { CommandBase } = require("discord.js-casanova");

module.exports = class PingCommand extends CommandBase {
  constructor() {
    super({
      name: "ping", // the name of the command.
      aliases: ["p"], // The aliases for the command <optional>.
      category: "Utils", // Category. <optional>
      clientPermissions: ["client permissions"], // <optional>
      cooldown: 4, // 0 for no cooldown <>.
      description: "description", // <optional>
      guildOnly: true, // <optional> default=true
      memberPermissions: ["member permissions"], // <optional>
      nsfw: false, // <optional> default=false
      ownerOnly: false, // <optional> default=false
      usage: "usage", // <optional>
    });
  }

  // Now every command Has to have an execute function.
  execute(message, args) {
    console.log(args);
    console.log(message.content);
    console.log(this.client.user.tag); // `this.client` being your client.
  }
};
```

#### Creating your first event!

Notice: This should be in each file in the events directory.

```js
// Now we gotta import the event base!
const { EventBase } = require("discord.js-casanova");

module.exports = class SomeEvent extends EventBase {
  constructor() {
    super({
      name: "Name of the event.",
      once: false, // <optional> weather the event should be emitted once or not.
    });
  }

  // Every event has to have an execute function.
  execute(...parms) {
    console.log(this.client.user.tag);
  }
};
```
