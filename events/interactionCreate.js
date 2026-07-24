const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const questions = require("../handlers/questions");
const interviewManager = require("../handlers/interviewManager");
const transcript = require("../handlers/transcript");
const settings = require("../handlers/settings");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {

    // ==========================
    // SLASH COMMANDS
    // ==========================
    if (interaction.isChatInputCommand()) {

      const command =
        interaction.client.commands.get(
          interaction.commandName
        );

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
    // BUTTONS
    // ==========================
    if (!interaction.isButton()) return;

    // ==========================
    // START INTERVIEW
    // ==========================
    if (interaction.customId === "start_interview") {

      if (
        interviewManager.hasInterview(
          interaction.user.id
        )
      ) {
        return interaction.reply({
          content:
            "❌ You already have an interview in progress.",
          ephemeral: true,
        });
      }

      const channel =
        await interaction.guild.channels.create({

          name:
            `interview-${interaction.user.username.toLowerCase()}`,

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

      interviewManager.startInterview(
        interaction.user.id
      );

      await interaction.reply({

        content:
          `✅ Your interview has started!\nGo to ${channel}.`,

        ephemeral: true,

      });

      await channel.send(

        `👋 Welcome ${interaction.user}!\n\n` +
        `**Question 1/${questions.length}**\n\n` +
        interviewManager.getQuestion(
          interaction.user.id
        )

      );

      return;
    }

    // ==========================
    // CANCEL INTERVIEW
    // ==========================
    if (
      interaction.customId ===
      "cancel_interview"
    ) {

      return interaction.reply({

        content:
          "❌ Interview cancelled.",

        ephemeral: true,

      });

    }

    // ==========================
    // ACCEPT BUTTON
    // ==========================
    if (interaction.customId.startsWith("accept_")) {

  const userId =
    interaction.customId.split("_")[1];

  const guildSettings =
    settings.getGuild(interaction.guild.id);

  if (!guildSettings.acceptRole) {
    return interaction.reply({
      content:
        "❌ Accept role hasn't been configured.",
      ephemeral: true,
    });
  }

  const member =
    await interaction.guild.members
      .fetch(userId)
      .catch(() => null);

  if (!member) {
    return interaction.reply({
      content:
        "❌ Applicant not found.",
      ephemeral: true,
    });
  }

  const role =
    interaction.guild.roles.cache.get(
      guildSettings.acceptRole
    );

  if (!role) {
    return interaction.reply({
      content:
        "❌ Accept role not found.",
      ephemeral: true,
    });
  }

  await member.roles.add(role);

  try {
    await member.send(
      `🎉 Congratulations! Your application to **${interaction.guild.name}** has been accepted.\n\nWelcome to the team!`
    );
  } catch {}

  const embed = EmbedBuilder
    .from(interaction.message.embeds[0])
    .setColor(0x57F287)
    .setTitle("✅ Interview Accepted")
    .spliceFields(3, 1, {
      name: "Status",
      value: `🟢 Accepted by ${interaction.user}`,
      inline: false,
    });

  await interaction.update({
    embeds: [embed],
    components: [],
  });

  return;
}
// ==========================
// REJECT BUTTON
// ==========================
if (interaction.customId.startsWith("reject_")) {

  const userId =
    interaction.customId.split("_")[1];

  const member =
    await interaction.guild.members
      .fetch(userId)
      .catch(() => null);

  if (!member) {
    return interaction.reply({
      content: "❌ Applicant not found.",
      ephemeral: true,
    });
  }

  try {
    await member.send(
      `❌ Your application to **${interaction.guild.name}** has been rejected.\n\nThank you for taking the time to apply.`
    );
  } catch {}

  const embed = EmbedBuilder
    .from(interaction.message.embeds[0])
    .setColor(0xED4245)
    .setTitle("❌ Interview Rejected")
    .spliceFields(3, 1, {
      name: "Status",
      value: `🔴 Rejected by ${interaction.user}`,
      inline: false,
    });

  await interaction.update({
    embeds: [embed],
    components: [],
  });

  return;
}
// ==========================
// TRANSCRIPT BUTTON
// ==========================
if (interaction.customId.startsWith("transcript_")) {

  const userId =
    interaction.customId.split("_")[1];

  const fs = require("fs");
  const path = require("path");

  const FILE = path.join(
    __dirname,
    "../data/interviews.json"
  );

  if (!fs.existsSync(FILE)) {
    return interaction.reply({
      content: "❌ No transcripts found.",
      ephemeral: true,
    });
  }

  let data = [];

  try {
    data = JSON.parse(
      fs.readFileSync(FILE, "utf8")
    );
  } catch (err) {
    return interaction.reply({
      content:
        "❌ Failed to read transcripts.",
      ephemeral: true,
    });
  }


  const interview =
  data.find(
    i => i.user.id === userId
  );


  if (!interview) {
    return interaction.reply({
      content:
        "❌ Transcript not found.",
      ephemeral: true,
    });
  }


  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("📄 Interview Transcript")
    .setDescription(
      `Applicant: <@${userId}>\n\n`
    )
    .setTimestamp();


  interview.answers.forEach(
    (answer, index) => {

      embed.addFields({
        name:
          `Question ${index + 1}`,

        value:
          answer || "No answer",
      });

    }
  );


    await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });

  return;
}

  }
};