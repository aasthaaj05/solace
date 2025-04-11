import { format, differenceInDays, isSameDay } from "date-fns";

export const EXAM_PHASES = [
  {
    name: "Preparation",
    description: "Weekly motivational affirmations",
    color: "#F4F8D3", // Yellow
    daysBeforeExam: 7,
  },
  {
    name: "Pre-Exam",
    description: "Calming quotes for the night before",
    color: "#A6F1E0", // Teal
    daysBeforeExam: 1,
  },
  {
    name: "Exam Day",
    description: "Uplifting messages for exam day",
    color: "#F7CFD8", // Pink
    daysBeforeExam: 0,
  },
  {
    name: "Recovery",
    description: "Gentle post-exam reminders",
    color: "#73C7C7", // Blue
    daysBeforeExam: -1, // After exam
  },
];

export function getCurrentPhase(examDate) {
  const today = new Date();
  const daysUntilExam = differenceInDays(examDate, today);

  // If the exam is more than 7 days away or already past by more than a day
  if (daysUntilExam > 7 || daysUntilExam < -1) {
    return null;
  }

  // Find the appropriate phase
  if (daysUntilExam <= -1) {
    return EXAM_PHASES[3]; // Recovery phase
  } else if (daysUntilExam === 0) {
    return EXAM_PHASES[2]; // Exam day
  } else if (daysUntilExam === 1) {
    return EXAM_PHASES[1]; // Pre-exam
  } else {
    return EXAM_PHASES[0]; // Preparation
  }
}

export function formatExamDate(date) {
  return format(date, "EEEE, MMMM do, yyyy");
}

export function getDaysUntilExam(examDate) {
  const days = differenceInDays(examDate, new Date());
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} until exam`;
  } else if (days === 0) {
    return "Today is exam day";
  } else {
    const daysPast = Math.abs(days);
    return `${daysPast} day${daysPast !== 1 ? 's' : ''} after exam`;
  }
}

export function isExamSoon(examDate) {
  const daysUntilExam = differenceInDays(examDate, new Date());
  return daysUntilExam >= -1 && daysUntilExam <= 7;
}

export function isToday(date) {
  return isSameDay(date, new Date());
}
