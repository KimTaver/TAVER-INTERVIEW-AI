const fs = require("fs");
const path = require("path");
const settings = require("./settings");

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const FILE = path.join(__dirname, "../data/interviews.json");

// ==========================
// SAVE TRANSCRIPT
// ==========================
function saveTranscript(user, interview) {
  let data = [];

  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
  }

  try {
    data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (err) {
    console.error("Failed to read interviews.json:", err);
    data = [];
  }

  data.push({
    user: {
      tag: user.tag,
      id: user.id,
    },
    date: new Date().toISOString(),
    answers: interview.answers,
    startedAt: interview.startedAt || Date.now(),
    finishedAt: Date.now(),
    totalQuestions: interview.answers.length,
    status: "Pending Review",
  });

  fs.writeFileSync(
    FILE,
    JSON.stringify(data, null, 2)
  );

  console.log(`✅ Saved interview for ${user.tag}`);
}

// ==========================
// SEND TO REVIEW CHANNEL
// ==========================
async function sendForReview(
  client,
  guild,
  user,
  interview
) {
  const guildSettings = settings.getGuild(guild.id);

  if (
    !guildSettings.reviewChannel ||
    !guildSettings.staffRole
  ) {
    console.log("❌ Review channel or staff role not configured.");
    return;
  }

  const channel =
    guild.channels.cache.get(
      guildSettings.reviewChannel
    );

  if (!channel) {
    console.log("❌ Review channel not found.");
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0xF1C40F)
    .setTitle("📋 New Interview Submission")
    .setDescription(
      "A new interview has been submitted for review."
    )
    .addFields(
      {
        name: "Applicant",
        value: `${user.tag}`,
        inline: true,
      },
      {
        name: "User ID",
        value: user.id,
        inline: true,
      },
      {
        name: "Questions Answered",
        value: `${interview.answers.length}`,
        inline: true,
      },
      {
        name: "Status",
        value: "🟡 Pending Review",
      }
    )
    .setThumbnail(user.displayAvatarURL())
    .setTimestamp();

  const buttons =
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_${user.id}`)
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅"),

      new ButtonBuilder()
        .setCustomId(`reject_${user.id}`)
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("❌"),

      new ButtonBuilder()
        .setCustomId(`transcript_${user.id}`)
        .setLabel("Transcript")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("📄")
    );

  await channel.send({
    content: `<@&${guildSettings.staffRole}>`,
    embeds: [embed],
    components: [buttons],
  });

  console.log("✅ Review message sent.");
}

module.exports = {
  saveTranscript,
  sendForReview,
};