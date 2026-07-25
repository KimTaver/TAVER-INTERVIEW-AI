const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function evaluateAnswer(question, expectedAnswer, userAnswer) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `
You are Taver Interview AI.

Your only job is to evaluate applicants for the N.G.N.V Family.

Score answers fairly.

Return ONLY this format:

Score: X/10
Feedback: ...
      `,
      },

      {
        role: "user",
        content: `
Question:
${question}

Expected Answer:
${expectedAnswer}

Applicant Answer:
${userAnswer}
        `,
      },
    ],

    temperature: 0.2,
  });

  return completion.choices[0].message.content;
}

module.exports = {
  evaluateAnswer,
};