// Sample exam data
export const examData = {
  type: "multiple", // 'single' or 'multiple'
  timer: 2685, // in seconds (44:45)
  language: "English",
  sections: [
    {
      id: "physics",
      name: "Physics",
      maxMarks: 8,
      instructions: [
        "This section contains physics questions.",
        "Each question carries 4 marks.",
        "Choose the best answer from the given options.",
      ],
      questions: [
        {
          id: 1,
          question: "What is the unit of electric current?",
          options: ["Ohm", "Volt", "Ampere", "Watt"],
          correctAnswer: 2,
        },
        {
          id: 2,
          question: "What is the SI unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correctAnswer: 0,
        },
        {
          id: 3,
          question: "What is the unit of electric current?",
          options: ["Ohm", "Volt", "Ampere", "Watt"],
          correctAnswer: 2,
        },
        {
          id: 4,
          question: "What is the SI unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correctAnswer: 0,
        },
        {
          id: 6,
          question: "What is the unit of electric current?",
          options: ["Ohm", "Volt", "Ampere", "Watt"],
          correctAnswer: 2,
        },
        {
          id: 7,
          question: "What is the SI unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correctAnswer: 0,
        },
        {
          id: 8,
          question: "What is the unit of electric current?",
          options: ["Ohm", "Volt", "Ampere", "Watt"],
          correctAnswer: 2,
        },
        {
          id: 9,
          question: "What is the SI unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correctAnswer: 0,
        },
        {
          id: 10,
          question: "What is the unit of electric current?",
          options: ["Ohm", "Volt", "Ampere", "Watt"],
          correctAnswer: 2,
        },
        {
          id: 11,
          question: "What is the SI unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correctAnswer: 0,
        },
        {
          id: 12,
          question: "What is the unit of electric current?",
          options: ["Ohm", "Volt", "Ampere", "Watt"],
          correctAnswer: 2,
        },
        {
          id: 13,
          question: "What is the SI unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correctAnswer: 0,
        },
        {
          id: 14,
          question: "What is the unit of electric current?",
          options: ["Ohm", "Volt", "Ampere", "Watt"],
          correctAnswer: 2,
        },
        {
          id: 15,
          question: "What is the SI unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: "chemistry",
      name: "Chemistry",
      maxMarks: 12,
      instructions: [
        "This section contains chemistry questions.",
        "Each question carries 3 marks.",
        "Negative marking: -1 for wrong answers.",
      ],
      questions: [
        {
          id: 1,
          question: "What is the chemical symbol for Gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: "mathematics",
      name: "Mathematics",
      maxMarks: 16,
      instructions: [
        "This section contains mathematics questions.",
        "Each question carries 4 marks.",
        "Partial marking available for some questions.",
      ],
      questions: [
        {
          id: 1,
          question: "What is the value of π (pi) approximately?",
          options: ["3.14", "2.71", "1.41", "1.73"],
          correctAnswer: 0,
        },
        {
          id: 2,
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
        },
      ],
    },
  ],
  gradeSchema: {
    positiveMarks: 4,
    negativeMarks: -1,
    partialMarks: 2,
  },
};
