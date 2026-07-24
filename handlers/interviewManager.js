const questions = require("./questions");

const interviews = new Map();

function startInterview(userId) {
  interviews.set(userId, {
    currentQuestion: 0,
    answers: [],
    startedAt: Date.now(),
  });
}

function hasInterview(userId) {
  return interviews.has(userId);
}

function getInterview(userId) {
  return interviews.get(userId);
}

function getQuestion(userId) {
  const interview = interviews.get(userId);

  if (!interview) return null;

  return questions[interview.currentQuestion];
}

function saveAnswer(userId, answer) {
  const interview = interviews.get(userId);

  if (!interview) return null;

  interview.answers.push(answer);
  interview.currentQuestion++;

  if (interview.currentQuestion >= questions.length) {
    return null;
  }

  return questions[interview.currentQuestion];
}

function finishInterview(userId) {
  const interview = interviews.get(userId);

  interviews.delete(userId);

  return interview;
}

module.exports = {
  startInterview,
  hasInterview,
  getInterview,
  getQuestion,
  saveAnswer,
  finishInterview,
};