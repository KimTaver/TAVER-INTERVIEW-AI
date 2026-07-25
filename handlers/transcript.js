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

// Debug: show where the transcript file is being saved
console.log("Transcript file:", FILE);

// ==========================
// SAVE TRANSCRIPT
// ==========================
function saveTranscript(user, interview) {
  let data = [];

  // Create file if it doesn't exist
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
  }

  // Read existing transcripts safely
  try {
    const content = fs.readFileSync(FILE, "utf8").trim();

    if (!content) {
      data = [];
    } else {
      data = JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to read interviews.json:", err);

    // Reset corrupted file
    data = [];
    fs.writeFileSync(FILE, "[]");
  }

  // Debug
  console.log("Interview data:", interview);

  // Save interview
  data.push({
  user: {
    tag: user.tag,
    id: user.id,
  },
  date: new Date().toISOString(),

  questions: interview.questions,

  answers: interview.answers,

  startedAt: interview.startedAt || Date.now(),
  finishedAt: Date.now(),
  totalQuestions: interview.questions.length,
  status: "Pending Review",
});

  // Write back to file
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

  const aiResults = interview.results.join("\n\n");

const embed = new EmbedBuilder()
  .setColor(0x5865F2)
  .setTitle("🤖 Taver Interview AI Report")
  .setDescription(
    `Interview completed by **${user.tag}**`
  )
  .addFields(
    {
      name: "👤 Applicant",
      value: user.tag,
      inline: true,
    },
    {
      name: "🆔 User ID",
      value: user.id,
      inline: true,
    },
    {
      name: "📝 Questions",
      value: `${interview.questions.length}`,
      inline: true,
    },
    {
      name: "🤖 AI Evaluation",
      value: aiResults.substring(0, 1024),
      inline: false,
    },
    {
      name: "Status",
      value: "🟡 Pending Staff Review",
      inline: false,
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