const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/interviews.json");

function saveTranscript(user, interview) {
  let data = [];

  // Create the data folder/file if it doesn't exist
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
  }

  // Read existing transcripts safely
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
    startedAt: interview.startedAt,
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

module.exports = {
  saveTranscript,
};