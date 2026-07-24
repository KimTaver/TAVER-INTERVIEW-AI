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
// Load Commands
// ==========================
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    try {
      const command = require(`./commands/${file}`);

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
      } else {
        console.log(`⚠️ ${file} is missing data or execute.`);
      }
    } catch (err) {
      console.error(`❌ Failed to load ${file}`, err);
    }
  }
}

// ==========================
// Load Events
// ==========================
const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {
    try {
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

      console.log(`✅ Loaded event: ${event.name}`);
    } catch (err) {
      console.error(`❌ Failed to load ${file}`, err);
    }
  }
}

// ==========================
// Ready
// ==========================
client.once("ready", () => {
  console.clear();

  console.log(`✅ Logged in as ${client.user.tag}`);

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

// ==========================
// Login
// ==========================
client.login(process.env.TOKEN);

// Prevent crashes
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);