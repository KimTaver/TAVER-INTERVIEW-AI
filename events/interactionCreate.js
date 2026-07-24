const {
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

const questions = require("../handlers/questions");
const interviewManager = require("../handlers/interviewManager");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {

    // ==========================
    // Slash Commands
    // ==========================
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

    // ==========================
    // Buttons
    // ==========================
    if (!interaction.isButton()) return;

    // ==========================
    // START INTERVIEW
    // ==========================
    if (interaction.customId === "start_interview") {

      // Prevent multiple interviews
      if (interviewManager.hasInterview(interaction.user.id)) {
        return interaction.reply({
          content: "❌ You already have an interview in progress.",
          ephemeral: true,
        });
      }

      const channel = await interaction.guild.channels.create({
        name: `interview-${interaction.user.username.toLowerCase()}`,
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

      // Start interview
      interviewManager.startInterview(interaction.user.id);

      await interaction.reply({
        content: `✅ Your interview has started!\nGo to ${channel}.`,
        ephemeral: true,
      });

      await channel.send(
        `👋 Welcome ${interaction.user}!\n\n**Question 1/${questions.length}**\n\n${interviewManager.getQuestion(interaction.user.id)}`
      );
    }

    // ==========================
    // CANCEL INTERVIEW
    // ==========================
    if (interaction.customId === "cancel_interview") {
      return interaction.reply({
        content: "❌ Interview cancelled.",
        ephemeral: true,
      });
    }
  },
};