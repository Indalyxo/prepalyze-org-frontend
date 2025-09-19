import {
  IconAlertTriangle,
  IconApple,
  IconChartBar,
  IconClipboardCheck,
  IconDatabase,
  IconDeviceDesktop,
  IconFlask2,
  IconInfoCircle,
  IconLock,
  IconMathFunction,
  IconPalette,
  IconPaw,
  IconPlant,
  IconShieldExclamation,
  IconUsers,
} from "@tabler/icons-react";

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

export const appSections =  [
  {
    title: "Organization Dashboard",
    description:
      "Comprehensive overview of all your exams, students, and performance metrics in one place",
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757255634/dasboard_cinofn.avif",
    icon: IconDeviceDesktop,
    features: ["Real-time analytics", "Quick actions", "Performance overview"],
  },
  {
    title: "Exam Page",
    description:
      "Create and manage your exams with ease using our intuitive repository interface",
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757255637/utk3d6fa5fzj9ppobuil_q7z8cr.avif",
    icon: IconDatabase,
    features: ["Manage exams", "Schedule Exams", "Online/Offline modes"],
  },
  {
    title: "Exam Builder",
    description:
      "Intuitive interface to create professional exam papers in minutes",
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757255606/create-option_az50j2.avif",
    icon: IconPalette,
    features: ["Single/Multi Subject", "Templates", "Preview mode"],
  },
  {
    title: "Online Exams",
    description:
      "Secure online testing environment with anti-cheating measures and real-time results",
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757255636/exam-interface_x01edq.avif",
    icon: IconLock,
    features: ["Live testing", "Anti-Cheat", "Time management"],
  },
  {
    title: "Group Students",
    description:
      "Easily organize students into groups for targeted exams and performance tracking",
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757255636/group-page_zqqknf.avif",
    icon: IconUsers,
    features: ["Create groups", "Assign exams", "Track performance"],
  },
  {
    title: "Downloadable Questions Editor",
    description:
      "Easily create and edit downloadable question papers with worksheet support",
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757255635/downloa-page_tr9yhj.avif",
    icon: IconClipboardCheck,
    features: ["Worksheet support", "Customization", "Multiple formats"],
  },
  {
    title: "Student Performance Dashboard",
    description:
      "Deep insights into student performance with detailed reports and recommendations",
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757255607/student-dashboard_raqehq.avif",
    icon: IconChartBar,
    features: ["Performance trends", "Comparative analysis", "Custom reports"],
  },
];

export const SubjectIcons = {
  Botany: IconPlant,
  Zoology: IconPaw,
  Chemistry: IconFlask2,
  Mathematics: IconMathFunction,
  Physics: IconApple,
};

export const SubjectColors = {
  Botany: "green",
  Zoology: "orange",
  Chemistry: "blue",
  Mathematics: "purple",
  Physics: "red",
};

