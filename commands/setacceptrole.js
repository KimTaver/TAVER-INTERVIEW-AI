const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const settings = require("../handlers/settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setacceptrole")
    .setDescription("Set the role given to accepted applicants.")
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Accepted applicant role")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    const role = interaction.options.getRole("role");

    settings.setGuild(interaction.guild.id, {
      acceptRole: role.id,
    });

    await interaction.reply({
      content: `✅ Accept role set to ${role}.`,
      ephemeral: true,
    });
  },
};