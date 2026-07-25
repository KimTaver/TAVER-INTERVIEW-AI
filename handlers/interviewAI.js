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

You evaluate applicants for the N.G.N.V Family.

Evaluate the applicant ONLY based on the expected answer.

Return ONLY valid JSON.

Example:

{
  "score": 9,
  "feedback": "Good answer. The applicant covered most of the important points.",
  "passed": true
}

Rules:
- score must be a number between 0 and 10.
- feedback must be short and professional.
- passed must be true if score is 7 or higher, otherwise false.
- Return ONLY JSON.
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

  const response = completion.choices[0].message.content.trim();

  try {
    return JSON.parse(response);
  } catch (err) {
    console.error("Failed to parse AI response:", response);

    return {
      score: 0,
      feedback: "The AI returned an invalid response.",
      passed: false,
    };
  }
}

module.exports = {
  evaluateAnswer,
};