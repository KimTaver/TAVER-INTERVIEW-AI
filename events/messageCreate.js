const questions = require("../handlers/questions");
const interviewManager = require("../handlers/interviewManager");
const transcript = require("../handlers/transcript");

module.exports = {
  name: "messageCreate",

  async execute(message) {
    if (message.author.bot) return;

    if (!message.guild) return;

    if (!message.channel.name.startsWith("interview-")) return;

    if (!interviewManager.hasInterview(message.author.id)) return;

    const nextQuestion = interviewManager.saveAnswer(
      message.author.id,
      message.content
    );

    // ==========================
    // Interview Finished
    // ==========================
    if (!nextQuestion) {

      const interviewData =
        interviewManager.finishInterview(
          message.author.id
        );

      // Save transcript
      transcript.saveTranscript(
        message.author,
        interviewData
      );

      // Send to review channel
      await transcript.sendForReview(
        message.client,
        message.guild,
        message.author,
        interviewData
      );

      await message.channel.send(
        "## ✅ Interview Completed\n" +
        "Thank you for completing your interview!\n\n" +
        "Your responses have been saved and have been sent to our staff for review.\n" +
        "Please wait patiently while we process your application."
      );

      return;
    }

    const currentQuestion =
      interviewManager.getQuestion(message.author.id);

    const questionNumber =
      questions.indexOf(currentQuestion) + 1;

    await message.channel.send(
      `## Question ${questionNumber}/${questions.length}\n\n${nextQuestion}`
    );
  },
};