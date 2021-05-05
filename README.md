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
  **`Note: command is the used command.\n message: is the message object.`**
  - cooldown(message, command, timeLeft) *note: timeLeft is in milliseconds.*
  - commandUsed(message, command).
  - missingPermissions(message, command, missing, type) *note: `missing` are the missing permissions and `type` is either client or member.*
  - commandBlocked(message, command, reason) *note: reason being "nsfw OR guildOnly OR ownerOnly"*
