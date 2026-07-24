const {
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("accept")
    .setDescription("Accept an interview applicant"),

  async execute(interaction) {

    await interaction.reply({
      content: "✅ Applicant accepted.",
      ephemeral: true,
    });

  },
};