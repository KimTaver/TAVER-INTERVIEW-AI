const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

const settings = require("../handlers/settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setreviewchannel")
    .setDescription("Set the interview review channel.")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Review channel")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    settings.setGuild(interaction.guild.id, {
      reviewChannel: channel.id,
    });

    await interaction.reply({
      content: `✅ Review channel set to ${channel}.`,
      ephemeral: true,
    });
  },
};