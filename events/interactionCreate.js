const {
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {

    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command =
        interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "❌ Something went wrong.",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "❌ Something went wrong.",
            ephemeral: true,
          });
        }
      }

      return;
    }

    // Buttons
    if (!interaction.isButton()) return;

    // ==========================
    // START INTERVIEW
    // ==========================
    if (interaction.customId === "start_interview") {

      const channel = await interaction.guild.channels.create({
        name: `interview-${interaction.user.username}`,
        type: ChannelType.GuildText,

        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [
              PermissionFlagsBits.ViewChannel,
            ],
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: interaction.client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ManageChannels,
            ],
          },
        ],
      });

      await interaction.reply({
        content:
          `✅ Your interview has started!\nGo to ${channel}.`,
        ephemeral: true,
      });

      await channel.send({
        content:
          `👋 Welcome ${interaction.user}!\n\n**Question 1/10**\n\nTell us about yourself.`,
      });
    }

    // ==========================
    // CANCEL
    // ==========================
    if (interaction.customId === "cancel_interview") {

      await interaction.reply({
        content: "❌ Interview cancelled.",
        ephemeral: true,
      });

    }

  },
};