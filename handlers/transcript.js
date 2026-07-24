const fs = require("fs");
const path = require("path");

const FILE = path.join(
  __dirname,
  "../data/interviews.json"
);

function saveTranscript(user, interview) {

  let data = [];

  if (fs.existsSync(FILE)) {
    data = JSON.parse(
      fs.readFileSync(FILE, "utf8")
    );
  }

  data.push({
    user: user.tag,
    id: user.id,
    date: new Date().toISOString(),
    answers: interview.answers,
  });

  fs.writeFileSync(
    FILE,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  saveTranscript,
};