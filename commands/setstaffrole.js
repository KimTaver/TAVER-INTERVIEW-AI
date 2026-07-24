const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const settings = require("../handlers/settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstaffrole")
    .setDescription("Set the interview staff role.")
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Staff role")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    const role = interaction.options.getRole("role");

    settings.setGuild(interaction.guild.id, {
      staffRole: role.id,
    });

    await interaction.reply({
      content: `✅ Staff role set to ${role}.`,
      ephemeral: true,
    });
  },
};