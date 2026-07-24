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
    .setDescription("Start your interview."),

  async execute(interaction) {

    if (!interaction.inGuild()) {
      return interaction.reply({
        content: "❌ This command can only be used inside a server.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("📋 TAVER INTERVIEW AI")
      .setDescription(
        [
          "Welcome to the **Taver Interview System**.",
          "",
          "Press **🟢 Start Interview** when you're ready.",
          "",
          "Your interview will take place in a private channel."
        ].join("\n")
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
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
      components: [row],
      ephemeral: true,
    });
  },
};