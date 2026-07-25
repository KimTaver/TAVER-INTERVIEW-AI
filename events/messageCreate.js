const interviewAI = require("../handlers/interviewAI");
const interviewManager = require("../handlers/interviewManager");
const transcript = require("../handlers/transcript");

module.exports = {
  name: "messageCreate",

  async execute(message) {

    console.log(
      `Message from ${message.author.tag}: ${message.content}`
    );

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

      // ==========================
      // AI Evaluation
      // ==========================
      interviewData.results = [];

      for (let i = 0; i < interviewData.questions.length; i++) {

        const result =
          await interviewAI.evaluateAnswer(

            interviewData.questions[i].question,

            interviewData.questions[i].answer,

            interviewData.answers[i]

          );

        interviewData.results.push(result);
      }

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

    const interview =
      interviewManager.getInterview(message.author.id);

    const questionNumber =
      interview.currentQuestion + 1;

    await message.channel.send(
      `## Question ${questionNumber}/${interview.questions.length}\n\n**${nextQuestion.question}**`
    );
  },
};