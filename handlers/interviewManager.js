const questions = require("./questions");

const interviews = new Map();

function startInterview(userId) {
  interviews.set(userId, {
    question: 0,
    answers: [],
  });
}

function hasInterview(userId) {
  return interviews.has(userId);
}

function getQuestion(userId) {
  const interview = interviews.get(userId);

  if (!interview) return null;

  return questions[interview.question];
}

function saveAnswer(userId, answer) {
  const interview = interviews.get(userId);

  if (!interview) return null;

  interview.answers.push(answer);
  interview.question++;

  if (interview.question >= questions.length) {
    return null;
  }

  return questions[interview.question];
}

function finishInterview(userId) {
  const interview = interviews.get(userId);

  interviews.delete(userId);

  return interview;
}

module.exports = {
  startInterview,
  hasInterview,
  getQuestion,
  saveAnswer,
  finishInterview,
};