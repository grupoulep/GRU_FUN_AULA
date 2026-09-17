import { Course, Subject, StudentAdmission, Activity, Banner, CentralAnnouncement } from '../types';

export const INITIAL_BANNERS: Banner[] = [];
export const INITIAL_COURSES: Course[] = [];
export const INITIAL_SUBJECTS: Subject[] = [];
export const INITIAL_STUDENTS: StudentAdmission[] = [];
export const INITIAL_ACTIVITIES: Activity[] = [];

export const INITIAL_CENTRAL_ANNOUNCEMENT: CentralAnnouncement = {
  title: '¡Bienvenidos al Periodo Académico 2026!',
  content: 'Recuerden revisar sus horarios y ponerse en contacto con sus docentes asignados ante cualquier inquietud.',
  active: false,
};
