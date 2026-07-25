// handlers/questions.js

const questions = {
  ranks: [
    {
      question: "What is the duty of a Rookie?",
      answer: "Observe and learn the family rules, follow orders from higher ranks, and prove loyalty through small tasks."
    },
    {
      question: "What is the responsibility of a Junior?",
      answer: "Support soldiers and enforcers, train skills, and prove reliability."
    },
    {
      question: "What is the duty of a Street Soldier?",
      answer: "Carry out missions, protect juniors, and enforce discipline."
    },
    {
      question: "What is the duty of an Elite Enforcer?",
      answer: "Protect the family, punish betrayal, and lead soldiers in battle."
    },
    {
      question: "Who commands a small squad of soldiers?",
      answer: "Crew Leader."
    },
    {
      question: "Who oversees multiple Crew Leaders?",
      answer: "Veteran Lieutenant."
    },
    {
      question: "Who controls major family operations?",
      answer: "Shadow Warlord."
    },
    {
      question: "Who acts as the Leader's voice?",
      answer: "Deputy Leader."
    },
    {
      question: "Who has supreme authority in the family?",
      answer: "Leader."
    }
  ],

  loyalty: [
    {
      question: "What does loyalty mean in the N.G.N.V Family?",
      answer: "Standing by the family, never switching sides, and remaining loyal."
    },
    {
      question: "Should members backstab each other?",
      answer: "No."
    },
    {
      question: "How should you correct another member?",
      answer: "Correct them privately, not publicly."
    }
  ],

  discipline: [
    {
      question: "Why is discipline important?",
      answer: "It keeps the family respected and organised."
    },
    {
      question: "Should emotions control your actions?",
      answer: "No."
    }
  ],

  teamwork: [
    {
      question: "Why is teamwork important?",
      answer: "Because the family fights as one unit."
    },
    {
      question: "How should radio communication be?",
      answer: "Short, clear, and precise."
    }
  ],

  money: [
    {
      question: "Should family members scam each other?",
      answer: "Never."
    },
    {
      question: "Why should members contribute money?",
      answer: "To strengthen the family."
    }
  ],

  war: [
    {
      question: "Should you make solo pushes during war?",
      answer: "No."
    },
    {
      question: "Name three war roles.",
      answer: "Driver, Shooter, Support."
    }
  ],

  crime: [
    {
      question: "Why should members understand RP laws?",
      answer: "To avoid bringing unnecessary trouble to the family."
    },
    {
      question: "What does 'Power means control, not recklessness' mean?",
      answer: "Use power wisely and avoid careless actions."
    }
  ]
};

function randomQuestion(category) {
  const list = questions[category];
  return list[Math.floor(Math.random() * list.length)];
}

function generateInterview() {
  return [
    randomQuestion("ranks"),
    randomQuestion("loyalty"),
    randomQuestion("discipline"),
    randomQuestion("teamwork"),
    randomQuestion("money"),
    randomQuestion("war"),
    randomQuestion("crime")
  ];
}

module.exports = {
  generateInterview
};