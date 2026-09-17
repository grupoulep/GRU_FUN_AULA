export interface Course {
  id: string;
  name: string;
  code: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  active: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  courseId: string;
  courseName: string;
  professor: string;
  weeklyHours: number;
}

export interface StudentAdmission {
  id: string;
  fullName: string;
  cedula: string;
  email: string;
  phone?: string;
  courseId: string;
  courseName: string;
  admissionDate: string;
  registrationType?: 'Admisión' | 'Registro' | 'Matrícula';
  initialPassword?: string;
  status: 'Admitido' | 'Pendiente' | 'Matriculado';
}

export type AdminSection = 'dashboard' | 'courses' | 'subjects' | 'admissions' | 'banners' | 'publicidad-principal' | 'anuncio';

export interface CentralAnnouncement {
  title: string;
  content: string;
  imageUrl?: string;
  active: boolean;
}

export type ActivityType = 'Tarea' | 'Taller' | 'Examen' | 'Proyecto' | 'Lectura';

export type QuestionType = 'multiple_choice' | 'multiple_selection' | 'true_false' | 'drag_and_drop';

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
}
