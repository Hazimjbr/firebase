export type Question = {
  text: string;
  options: string[];
  correctAnswer: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  time: number;
  questions: Question[];
};

export const quizzes: Quiz[] = [
  {
    id: "fundamentals",
    title: "Chemistry Fundamentals",
    description: "A quiz on the basic principles of chemistry, including atoms and molecules.",
    time: 10,
    questions: [
      {
        text: "What is the smallest unit of a chemical element?",
        options: ["Molecule", "Atom", "Electron", "Proton"],
        correctAnswer: "Atom",
      },
      {
        text: "Which of the following is a noble gas?",
        options: ["Oxygen", "Nitrogen", "Helium", "Hydrogen"],
        correctAnswer: "Helium",
      },
      {
        text: "What is the chemical symbol for Gold?",
        options: ["Ag", "Au", "Gd", "Go"],
        correctAnswer: "Au",
      },
    ],
  },
  {
    id: "organic-chemistry-basics",
    title: "Organic Chemistry Basics",
    description: "Test your knowledge of basic organic chemistry concepts.",
    time: 15,
    questions: [
      {
        text: "What is the main element in organic compounds?",
        options: ["Oxygen", "Nitrogen", "Carbon", "Hydrogen"],
        correctAnswer: "Carbon",
      },
      {
        text: "Which of these is the simplest alkane?",
        options: ["Methane", "Ethene", "Propane", "Butane"],
        correctAnswer: "Methane",
      },
      {
        text: "What functional group defines an alcohol?",
        options: ["-COOH (Carboxyl)", "-OH (Hydroxyl)", "-NH2 (Amino)", "-CHO (Aldehyde)"],
        correctAnswer: "-OH (Hydroxyl)",
      },
    ],
  },
];
