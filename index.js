require("dotenv").config();

const {
  Client,
  Collection,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

// ==========================
// Load Slash Commands
// ==========================
const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Loaded command: ${command.data.name}`);
  }
}

// ==========================
// Load Events
// ==========================
const eventsPath = path.join(__dirname, "events");

const eventFiles = fs
  .readdirSync(eventsPath)
  .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) =>
      event.execute(...args)
    );
  } else {
    client.on(event.name, (...args) =>
      event.execute(...args)
    );
  }
}

client.once("ready", () => {
  console.clear();

  console.log(
    `✅ ${client.user.tag} is online!`
  );

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "/interview",
        type: ActivityType.Watching,
      },
    ],
  });
});

client.login(process.env.TOKEN);