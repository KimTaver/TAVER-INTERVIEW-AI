const questions = require("../handlers/questions");
const interviewManager = require("../handlers/interviewManager");

module.exports = {
  name: "messageCreate",

  async execute(message) {

    if (message.author.bot) return;

    if (!message.channel.name.startsWith("interview-")) return;

    if (!interviewManager.hasInterview(message.author.id)) return;

    const nextQuestion =
      interviewManager.saveAnswer(
        message.author.id,
        message.content
      );

    if (!nextQuestion) {

      const data =
        interviewManager.finishInterview(
          message.author.id
        );

      await message.channel.send(
        "✅ Your interview has been completed.\nThank you for your time!"
      );

      console.log(data);

      return;
    }

    const interview =
      data = interviewManager.hasInterview(message.author.id);

    const current =
      interviewManager.getQuestion(message.author.id);

    const index =
      questions.indexOf(current) + 1;

    await message.channel.send(
      `**Question ${index}/${questions.length}**\n\n${nextQuestion}`
    );

  },
};