import { Course, Subject, StudentAdmission, Teacher, Activity, Banner, CentralAnnouncement, StudentGrade } from '../types';

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'Inscripciones Abiertas Periodo 2026',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    active: true
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-sistemas',
    name: 'Técnico Laboral en Sistemas e Informática',
    code: 'TEC-SIS-101',
    programType: 'Técnico',
    duration: '3 Semestres'
  },
  {
    id: 'crs-admin',
    name: 'Técnico Laboral en Asistencia Administrativa',
    code: 'TEC-ADM-101',
    programType: 'Técnico',
    duration: '3 Semestres'
  },
  {
    id: 'crs-excel',
    name: 'Curso Especializado en Excel Financiero',
    code: 'CUR-EXC-01',
    programType: 'Curso',
    duration: '40 Horas'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    fullName: 'Prof. Carlos Andrés Mendoza',
    cedula: '1098765432',
    email: 'carlos.mendoza@ulep.edu.co',
    phone: '3154872910',
    courseIds: ['crs-sistemas'],
    courseName: 'Ingeniería de Sistemas y Computación',
    initialPassword: 'doc-1098765432',
    status: 'Activo',
    registrationDate: '2026-01-15'
  },
  {
    id: 'tch-2',
    fullName: 'Dra. María Elena Restrepo',
    cedula: '1087654321',
    email: 'maria.restrepo@ulep.edu.co',
    phone: '3189023412',
    courseIds: ['crs-admin'],
    courseName: 'Administración de Empresas y Gestión',
    initialPassword: 'doc-1087654321',
    status: 'Activo',
    registrationDate: '2026-01-16'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sbj-prog1',
    name: 'Programación Web y Aplicaciones',
    code: 'SIS-201',
    credits: 4,
    courseId: 'crs-sistemas',
    courseName: 'Ingeniería de Sistemas y Computación',
    professor: 'Prof. Carlos Andrés Mendoza',
    professorId: 'tch-1',
    professorCedula: '1098765432',
    weeklyHours: 6
  },
  {
    id: 'sbj-bd',
    name: 'Bases de Datos Relacionales y NoSQL',
    code: 'SIS-202',
    credits: 3,
    courseId: 'crs-sistemas',
    courseName: 'Ingeniería de Sistemas y Computación',
    professor: 'Prof. Carlos Andrés Mendoza',
    professorId: 'tch-1',
    professorCedula: '1098765432',
    weeklyHours: 4
  },
  {
    id: 'sbj-contab',
    name: 'Contabilidad Financiera y Presupuestos',
    code: 'ADM-201',
    credits: 4,
    courseId: 'crs-admin',
    courseName: 'Administración de Empresas y Gestión',
    professor: 'Dra. María Elena Restrepo',
    professorId: 'tch-2',
    professorCedula: '1087654321',
    weeklyHours: 4
  }
];

export const INITIAL_STUDENTS: StudentAdmission[] = [
  {
    id: 'std-1',
    fullName: 'Juan David Gómez Pérez',
    cedula: '1012345678',
    email: 'juan.gomez@estudiante.ulep.edu.co',
    phone: '3201234567',
    courseId: 'crs-sistemas',
    courseIds: ['crs-sistemas'],
    courseName: 'Ingeniería de Sistemas y Computación',
    admissionDate: '2026-01-20',
    registrationType: 'Matrícula',
    initialPassword: 'est-1012345678',
    status: 'Matriculado'
  },
  {
    id: 'std-2',
    fullName: 'Valentina Torres Salazar',
    cedula: '1023456789',
    email: 'valentina.torres@estudiante.ulep.edu.co',
    phone: '3219876543',
    courseId: 'crs-sistemas',
    courseIds: ['crs-sistemas', 'crs-admin'],
    courseName: 'Ingeniería de Sistemas y Computación, Administración de Empresas y Gestión',
    admissionDate: '2026-01-22',
    registrationType: 'Matrícula',
    initialPassword: 'est-1023456789',
    status: 'Matriculado'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    subjectId: 'sbj-prog1',
    title: 'Taller 1: Arquitectura de Componentes Web',
    description: 'Diseñar e implementar componentes modulares reutilizables con TypeScript y Tailwind CSS.',
    dueDate: '2026-11-15',
    order: 1,
    weight: 30,
    type: 'Taller',
    status: 'Entregada',
    grade: 4.8,
    submissionNotes: 'Entrega de repositorio con componentes probados y funcionales.',
    resourceLink: 'https://react.dev'
  },
  {
    id: 'act-2',
    subjectId: 'sbj-prog1',
    title: 'Examen Parcial: Fundamentos de Frontend y React',
    description: 'Evaluación online de conocimientos teóricos y prácticos sobre estado, props y renderizado.',
    dueDate: '2026-11-20',
    order: 2,
    weight: 30,
    type: 'Examen',
    examCompleted: true,
    examScore: 90,
    grade: 4.5,
    examQuestions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: '¿Qué propiedad de React permite renderizar listas de manera eficiente reconociendo qué elementos han cambiado?',
        options: ['key', 'ref', 'id', 'name'],
        correctOptionIndex: 0,
        explanation: 'La prop "key" ayuda a React a identificar qué ítems han cambiado, son añadidos o eliminados.'
      },
      {
        id: 'q2',
        type: 'true_false',
        question: '¿Los Hooks de React solo deben invocarse en el nivel superior de los componentes de función?',
        options: ['Verdadero', 'Falso'],
        correctOptionIndex: 0,
        explanation: 'No se deben llamar Hooks dentro de bucles, condicionales o funciones anidadas.'
      }
    ]
  }
];

export const INITIAL_GRADES: StudentGrade[] = [
  {
    id: 'std-1_sbj-prog1',
    studentId: 'std-1',
    studentCedula: '1012345678',
    studentName: 'Juan David Gómez Pérez',
    subjectId: 'sbj-prog1',
    subjectName: 'Programación Web y Aplicaciones',
    courseId: 'crs-sistemas',
    corte1: 4.5,
    corte2: 4.8,
    corte3: 4.6,
    definitiva: 4.6,
    updatedAt: '2026-10-10'
  },
  {
    id: 'std-1_sbj-bd',
    studentId: 'std-1',
    studentCedula: '1012345678',
    studentName: 'Juan David Gómez Pérez',
    subjectId: 'sbj-bd',
    subjectName: 'Bases de Datos Relacionales y NoSQL',
    courseId: 'crs-sistemas',
    corte1: 4.0,
    corte2: 3.9,
    corte3: 4.3,
    definitiva: 4.1,
    updatedAt: '2026-10-12'
  },
  {
    id: 'std-2_sbj-prog1',
    studentId: 'std-2',
    studentCedula: '1023456789',
    studentName: 'Valentina Torres Salazar',
    subjectId: 'sbj-prog1',
    subjectName: 'Programación Web y Aplicaciones',
    courseId: 'crs-sistemas',
    corte1: 4.2,
    corte2: 4.5,
    corte3: 4.8,
    definitiva: 4.5,
    updatedAt: '2026-10-10'
  }
];

export const INITIAL_CENTRAL_ANNOUNCEMENT: CentralAnnouncement = {
  title: '¡Bienvenidos al Periodo Académico 2026!',
  content: 'Recuerden revisar sus asignaturas matriculadas, consultar la planilla de calificaciones y mantenerse al día con sus actividades.',
  active: true,
};
