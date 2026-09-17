const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
/export interface ExamQuestion \{[\s\S]*?readingEstimatedMinutes\?: number;\n\}/g,
`export type QuestionType = 'multiple_choice' | 'multiple_selection' | 'true_false' | 'drag_and_drop';

export interface DragDropMatch {
  item: string;
  match: string;
}

export interface ExamQuestion {
  id: string;
  type?: QuestionType; // Defaults to multiple_choice
  question: string;
  options?: string[]; // Multiple choice / Multiple selection / True false
  correctOptionIndex?: number; // Multiple choice / True false
  correctOptionIndices?: number[]; // Multiple selection
  dragDropPairs?: DragDropMatch[]; // Drag and drop
  explanation?: string;
}

export interface Activity {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  order: number;
  weight: number;
  type: ActivityType;
  status?: 'Pendiente' | 'Entregada' | 'Calificada';
  submissionNotes?: string;
  submittedAt?: string;
  grade?: number;
  // Resource link for Taller and Tarea
  resourceLink?: string;
  // Interactive Exam Form configuration and results
  examQuestions?: ExamQuestion[];
  examScore?: number;
  examCompleted?: boolean;
  studentAnswers?: Record<string, any>;
  examTimeLimitMinutes?: number;
  examMaxAttempts?: number;
  examAttemptsCount?: number;
  examStartedAt?: string;
  // Interactive Reading with rich text and emojis
  readingContent?: string;
  readingEstimatedMinutes?: number;
}`
);

fs.writeFileSync('src/types.ts', code);
