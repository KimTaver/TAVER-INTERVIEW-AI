const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

const settings = require("../handlers/settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setreviewchannel")
    .