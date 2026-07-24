const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("interview")
    .setDescription("Start an interview."),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("📋 TAVER INTERVIEW AI")
      .setDescription(
        "Welcome to the interview system.\n\nPress **Start Interview** when you're ready."
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("start_interview")
        .setLabel("Start Interview")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🟢"),

      new ButtonBuilder()
        .setCustomId("cancel_interview")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🔴")
    );

    await interaction.reply({
      embeds: [embed],
      components: [buttons],
    });
  },
};