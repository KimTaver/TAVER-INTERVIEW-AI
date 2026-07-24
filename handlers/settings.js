const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/guildSettings.json");

function getSettings() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "{}");
  }

  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveSettings(settings) {
  fs.writeFileSync(FILE, JSON.stringify(settings, null, 2));
}

function getGuild(guildId) {
  const settings = getSettings();

  if (!settings[guildId]) {
    settings[guildId] = {};
    saveSettings(settings);
  }

  return settings[guildId];
}

function setGuild(guildId, data) {
  const settings = getSettings();

  settings[guildId] = {
    ...settings[guildId],
    ...data,
  };

  saveSettings(settings);
}

module.exports = {
  getGuild,
  setGuild,
};