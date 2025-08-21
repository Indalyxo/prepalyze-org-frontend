// Sample exam data
export const examData = {
  title: "Sample Exam",
  subtitle: "Mathematics and Science Test",
  timer: 3600, // 1 hour in seconds
  sections: [
    {
      name: "Mathematics",
      instructions: [
        "Read each question carefully",
        "Select the best answer for multiple choice questions",
        "Enter numerical values for calculation questions",
        "You can mark questions for review",
      ],
      questions: [
        {
          id: 1,
          type: "multiple-choice",
          text: "What is 2 + 2?",
          options: [
            { id: 0, text: "3" },
            { id: 1, text: "4" },
            { id: 2, text: "5" },
            { id: 3, text: "6" },
          ],
        },
        {
          id: 2,
          type: "numerical",
          text: "Calculate the value of π (pi) to 2 decimal places:",
          placeholder: "Enter your answer (e.g., 3.14)",
        },
        {
          id: 3,
          type: "multiple-choice",
          text: "Which of the following is a prime number?",
          options: [
            { id: 0, text: "4" },
            { id: 1, text: "6" },
            { id: 2, text: "7" },
            { id: 3, text: "8" },
          ],
        },
        {
          id: 4,
          type: "numerical",
          text: "What is the square root of 144?",
          placeholder: "Enter the numerical answer",
        },
      ],
    },
    {
      name: "Science",
      instructions: [
        "Answer all questions to the best of your ability",
        "Use scientific notation where appropriate",
        "Round numerical answers to appropriate significant figures",
      ],
      questions: [
        {
          id: 5,
          type: "multiple-choice",
          text: "What is the chemical symbol for water?",
          options: [
            { id: 0, text: "H2O" },
            { id: 1, text: "CO2" },
            { id: 2, text: "NaCl" },
            { id: 3, text: "O2" },
          ],
        },
        {
          id: 6,
          type: "numerical",
          text: "What is the speed of light in vacuum (in m/s)?",
          placeholder: "Enter in scientific notation (e.g., 3e8)",
        },
      ],
    },
  ],
};
