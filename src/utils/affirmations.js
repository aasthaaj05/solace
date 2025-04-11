export const affirmations = {
    preparation: [
      {
        text: "Every day of preparation brings you closer to success.",
        author: "Anonymous"
      },
      {
        text: "Your dedication today is creating your success tomorrow.",
        author: "Anonymous"
      },
      {
        text: "Knowledge is built one concept at a time, just as a wall is built one brick at a time.",
        author: "Anonymous"
      },
      {
        text: "What we think, we become. What we feel, we attract. What we imagine, we create.",
        author: "Buddha"
      },
      {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
      },
      {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt"
      },
      {
        text: "Success is the sum of small efforts, repeated day in and day out.",
        author: "Robert Collier"
      }
    ],
    preExam: [
      {
        text: "Trust in your preparation. You've worked hard for this moment.",
        author: "Anonymous"
      },
      {
        text: "Tonight, rest. Tomorrow, shine.",
        author: "Anonymous"
      },
      {
        text: "Your mind knows more than you think it knows.",
        author: "Anonymous"
      },
      {
        text: "Breathe in confidence, breathe out doubt.",
        author: "Anonymous"
      },
      {
        text: "The calm mind is the one that performs best.",
        author: "Anonymous"
      },
      {
        text: "Your preparation deserves your confidence.",
        author: "Anonymous"
      },
      {
        text: "Sleep is the final preparation. Rest well.",
        author: "Anonymous"
      }
    ],
    examDay: [
      {
        text: "Today is your moment to shine and show what you know.",
        author: "Anonymous"
      },
      {
        text: "You are capable, you are prepared, you are ready.",
        author: "Anonymous"
      },
      {
        text: "Take each question one at a time. You've got this.",
        author: "Anonymous"
      },
      {
        text: "Remember to breathe. Your calm mind is your greatest asset today.",
        author: "Anonymous"
      },
      {
        text: "Trust in your knowledge and ability. This is your time.",
        author: "Anonymous"
      },
      {
        text: "You have prepared for this. Now let your knowledge flow.",
        author: "Anonymous"
      },
      {
        text: "Focus not on fear, but on showcasing what you've learned.",
        author: "Anonymous"
      }
    ],
    recovery: [
      {
        text: "The exam is over. Now is the time for rest and recovery.",
        author: "Anonymous"
      },
      {
        text: "You showed up. You did your best. That is all that matters.",
        author: "Anonymous"
      },
      {
        text: "Let go of what you cannot change. Be proud of your effort.",
        author: "Anonymous"
      },
      {
        text: "One exam does not define your worth or your future.",
        author: "Anonymous"
      },
      {
        text: "Take time to rest and restore. You've earned it.",
        author: "Anonymous"
      },
      {
        text: "Each challenge you face makes you stronger for the next one.",
        author: "Anonymous"
      },
      {
        text: "Be kind to yourself. You've completed something challenging.",
        author: "Anonymous"
      }
    ]
  };
  
  export function getRandomAffirmation(type) {
    const affirmationsForType = affirmations[type];
    const randomIndex = Math.floor(Math.random() * affirmationsForType.length);
    return affirmationsForType[randomIndex];
  }
  
  export function getAffirmationForPhase(phaseName) {
    switch (phaseName) {
      case "Preparation":
        return getRandomAffirmation("preparation");
      case "Pre-Exam":
        return getRandomAffirmation("preExam");
      case "Exam Day":
        return getRandomAffirmation("examDay");
      case "Recovery":
        return getRandomAffirmation("recovery");
      default:
        return getRandomAffirmation("preparation");
    }
  }
  