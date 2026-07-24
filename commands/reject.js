const {
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reject")
    .setDescription("Reject an interview applicant"),

  async execute(interaction) {

    await interaction.reply({
      content: "❌ Applicant rejected.",
      ephemeral: true,
    });

  },
};