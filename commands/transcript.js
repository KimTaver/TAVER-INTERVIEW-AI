const {
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transcript")
    .setDescription("View interview transcripts"),

  async execute(interaction) {

    await interaction.reply({
      content:
        "📄 Transcript system coming soon.",
      ephemeral: true,
    });

  },
};