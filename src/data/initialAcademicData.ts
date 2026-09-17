import { Course, Subject, StudentAdmission, Activity, Banner, CentralAnnouncement } from '../types';

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
    title: '¡Bienvenidos al nuevo semestre 2026-I!',
    active: true
  },
  {
    id: 'banner-2',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
    title: 'Feria de Emprendimiento Tecnológico - Inscríbete ya',
    active: true
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-1',
    name: 'Ingeniería de Sistemas - Semestre I',
    code: 'SIS-101'
  },
  {
    id: 'crs-2',
    name: 'Administración de Empresas - Semestre II',
    code: 'ADM-201'
  },
  {
    id: 'crs-3',
    name: 'Contaduría Pública - Semestre I',
    code: 'CON-101'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sbj-1',
    name: 'Cálculo Diferencial',
    code: 'MAT-101',
    credits: 4,
    courseId: 'crs-1',
    courseName: 'Ingeniería de Sistemas - Semestre I',
    professor: 'Dr. Roberto Sandoval',
    weeklyHours: 5
  },
  {
    id: 'sbj-2',
    name: 'Algoritmos y Programación Básica',
    code: 'SIS-102',
    credits: 4,
    courseId: 'crs-1',
    courseName: 'Ingeniería de Sistemas - Semestre I',
    professor: 'Ing. Mariana Salazar',
    weeklyHours: 6
  },
  {
    id: 'sbj-3',
    name: 'Teoría de las Organizaciones',
    code: 'ADM-105',
    credits: 3,
    courseId: 'crs-2',
    courseName: 'Administración de Empresas - Semestre II',
    professor: 'Lic. Fernando Ortiz',
    weeklyHours: 4
  },
  {
    id: 'sbj-4',
    name: 'Contabilidad Financiera I',
    code: 'CON-102',
    credits: 4,
    courseId: 'crs-3',
    courseName: 'Contaduría Pública - Semestre I',
    professor: 'C.P. Beatriz Villalba',
    weeklyHours: 5
  }
];

export const INITIAL_STUDENTS: StudentAdmission[] = [
  {
    id: 'std-1',
    fullName: 'Alejandro Morales Ríos',
    cedula: '30455678',
    email: 'a.morales@institucion.edu',
    phone: '+57 310 455 6789',
    courseId: 'crs-1',
    courseName: 'Ingeniería de Sistemas - Semestre I',
    admissionDate: '2026-02-10',
    registrationType: 'Admisión',
    initialPassword: 'est-30455678',
    status: 'Admitido'
  },
  {
    id: 'std-2',
    fullName: 'Valentina Restrepo Gil',
    cedula: '31222444',
    email: 'v.restrepo@institucion.edu',
    phone: '+57 312 224 4455',
    courseId: 'crs-1',
    courseName: 'Ingeniería de Sistemas - Semestre I',
    admissionDate: '2026-02-12',
    registrationType: 'Registro',
    initialPassword: 'est-31222444',
    status: 'Matriculado'
  },
  {
    id: 'std-3',
    fullName: 'Diego Armando Silva',
    cedula: '29888777',
    email: 'd.silva@institucion.edu',
    phone: '+57 315 888 7771',
    courseId: 'crs-2',
    courseName: 'Administración de Empresas - Semestre II',
    admissionDate: '2026-02-15',
    registrationType: 'Admisión',
    initialPassword: 'est-29888777',
    status: 'Admitido'
  },
  {
    id: 'std-4',
    fullName: 'Camila Sofía Núñez',
    cedula: '32111999',
    email: 'c.nunez@institucion.edu',
    phone: '+57 318 111 9992',
    courseId: 'crs-3',
    courseName: 'Contaduría Pública - Semestre I',
    admissionDate: '2026-02-18',
    registrationType: 'Registro',
    initialPassword: 'est-32111999',
    status: 'Pendiente'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  // Asignatura sbj-1: Cálculo Diferencial
  {
    id: 'act-1',
    subjectId: 'sbj-1',
    order: 1,
    title: 'Actividad 1: Taller de Límites Algebraicos y Continuidad',
    description: 'Resolver los ejercicios de la sección 2.1 a 2.4 de la guía temática. Demostrar el análisis de asíntotas verticales y discontinuidades removibles.',
    dueDate: '2026-03-25',
    weight: 20,
    type: 'Taller',
    resourceLink: 'https://es.khanacademy.org/math/differential-calculus',
    status: 'Entregada',
    submittedAt: '2026-03-20T14:30:00'
  },
  {
    id: 'act-2',
    subjectId: 'sbj-1',
    order: 2,
    title: 'Actividad 2: Guía de Derivación por Regla de la Cadena',
    description: 'Aplicación de teoremas de derivación de funciones trigonométricas, exponenciales y logarítmicas. Adjuntar procedimiento paso a paso en formato PDF.',
    dueDate: '2026-04-10',
    weight: 25,
    type: 'Tarea',
    resourceLink: 'https://openstax.org/details/books/calculus-volume-1',
    status: 'Pendiente'
  },
  {
    id: 'act-3',
    subjectId: 'sbj-1',
    order: 3,
    title: 'Actividad 3: Primer Examen Parcial Individual',
    description: 'Evaluación sincrónica individual de cálculo diferencial. Responde las preguntas formuladas en el cuestionario interactivo.',
    dueDate: '2026-04-24',
    weight: 30,
    type: 'Examen',
    status: 'Pendiente',
    examQuestions: [
      {
        id: 'q1',
        question: '¿Cuál es la derivada de la función f(x) = x³ - 5x + 4 respecto a x?',
        options: [
          'f\'(x) = 3x² - 5',
          'f\'(x) = 3x² + 5',
          'f\'(x) = 2x - 5',
          'f\'(x) = x² - 5'
        ],
        correctOptionIndex: 0,
        explanation: 'Por la regla de potencias: d/dx(x³) = 3x², d/dx(-5x) = -5, d/dx(4) = 0.'
      },
      {
        id: 'q2',
        question: '¿Qué representa geométricamente el valor f\'(a) de una función f(x) continua y suave en x = a?',
        options: [
          'El área total encerrada bajo la curva.',
          'La pendiente de la recta tangente a la curva en el punto (a, f(a)).',
          'La concavidad de la curva en el punto de inflexión.',
          'La asíntota horizontal de la función.'
        ],
        correctOptionIndex: 1,
        explanation: 'La derivada en un punto representa geométricamente la pendiente de la recta tangente en dicho punto.'
      },
      {
        id: 'q3',
        question: 'Si se cumple que lim(x -> a) f(x) = f(a), ¿qué condición se garantiza de forma directa?',
        options: [
          'La función f(x) tiene una discontinuidad evitable.',
          'La función f(x) es continua en x = a.',
          'La derivada f\'(a) siempre existe y es positiva.',
          'La función tiene un máximo local en x = a.'
        ],
        correctOptionIndex: 1,
        explanation: 'Esta es la definición fundamental de continuidad en un punto.'
      }
    ]
  },
  {
    id: 'act-4',
    subjectId: 'sbj-1',
    order: 4,
    title: 'Actividad 4: Proyecto de Modelado y Optimización de Costos',
    description: 'Modelar un caso real de optimización geométrica o industrial usando el criterio de la primera y segunda derivada. Entrega de informe técnico y sustentación.',
    dueDate: '2026-05-18',
    weight: 25,
    type: 'Proyecto',
    status: 'Pendiente'
  },

  // Asignatura sbj-2: Algoritmos y Programación Básica
  {
    id: 'act-5',
    subjectId: 'sbj-2',
    order: 1,
    title: 'Actividad 1: Laboratorio de Pseudocódigo y Diagramas de Flujo',
    description: 'Construcción de diagramas de bloques y lógica secuencial con estructuras condicionales anidadas para control de flujo de inventarios.',
    dueDate: '2026-03-28',
    weight: 20,
    type: 'Taller',
    resourceLink: 'https://replit.com',
    status: 'Entregada',
    submittedAt: '2026-03-22T09:15:00'
  },
  {
    id: 'act-6',
    subjectId: 'sbj-2',
    order: 2,
    title: 'Actividad 2: Taller de Arreglos Unidimensionales y Matrices',
    description: 'Implementación de algoritmos de ordenamiento (burbuja e inserción) y búsqueda binaria sobre vectores dinámicos.',
    dueDate: '2026-04-15',
    weight: 30,
    type: 'Tarea',
    resourceLink: 'https://github.com',
    status: 'Pendiente'
  },
  {
    id: 'act-7',
    subjectId: 'sbj-2',
    order: 3,
    title: 'Actividad 3: Proyecto Final de Software - Sistema Modular',
    description: 'Diseño e implementación de un sistema modular de consola con persistencia de datos en archivos planos o JSON, con validaciones robustas.',
    dueDate: '2026-05-22',
    weight: 50,
    type: 'Proyecto',
    status: 'Pendiente'
  },

  // Asignatura sbj-3: Teoría de las Organizaciones
  {
    id: 'act-8',
    subjectId: 'sbj-3',
    order: 1,
    title: 'Actividad 1: Lectura Crítica - Escuelas y Modelos Administrativos',
    description: 'Lectura formativa sobre la evolución de las teorías organizacionales, desde los postulados clásicos hasta la gestión del talento humano.',
    dueDate: '2026-03-30',
    weight: 25,
    type: 'Lectura',
    status: 'Pendiente',
    readingEstimatedMinutes: 8,
    readingContent: `📚 UNIDAD FORMATIVA: Evolución del Pensamiento Organizacional

✨ INTRODUCCIÓN Y CONTEXTO
Las organizaciones modernas operan en entornos dinámicos caracterizados por la transformación digital 💻, la incertidumbre y la necesidad constante de innovación 🚀. Para comprender su funcionamiento actual, es indispensable explorar las escuelas que sentaron sus bases:

🏛️ 1. LA ESCUELA CLÁSICA (Henri Fayol)
• 📌 Énfasis en la estructura formal y los procesos directivos.
• ⚙️ Los 14 principios de la administración: unidad de mando, disciplina, división del trabajo y subordinación del interés particular.
• 🎯 Visión de la empresa como un engranaje coordinado hacia la eficiencia.

🔬 2. LA ADMINISTRACIÓN CIENTÍFICA (Frederick Taylor)
• ⏱️ Racionalización del trabajo operativo mediante estudios de tiempos y movimientos.
• 📈 Especialización del operario y remuneración por incentivos de producción.
• ⚠️ Crítica contemporánea: deshumanización inicial de las tareas laborales.

🧠 3. EL ENFOQUE DE LAS RELACIONES HUMANAS (Elton Mayo)
• 🤝 Los experimentos de Hawthorne demostraron que el factor psicológico y la motivación grupal superan a las condiciones físicas.
• 🌟 El liderazgo, la comunicación abierta y el clima laboral son determinantes en el rendimiento.

💡 REFLEXIÓN Y PREGUNTAS DE ANÁLISIS:
1. ¿De qué manera los principios de Fayol se aplican hoy en empresas de tecnología ágiles? 📱
2. ¿Cómo equilibrar la eficiencia algorítmica con el bienestar de los colaboradores? 🌿
3. Comparte en clase tus conclusiones sobre liderazgo empático y gestión del cambio. 🎓`
  },
  {
    id: 'act-9',
    subjectId: 'sbj-3',
    order: 2,
    title: 'Actividad 2: Análisis de Caso - Cultura y Clima Organizacional',
    description: 'Diagnóstico de una empresa local evaluando liderazgo, canales de comunicación y resistencia al cambio tecnológico.',
    dueDate: '2026-04-28',
    weight: 35,
    type: 'Taller',
    status: 'Pendiente'
  },
  {
    id: 'act-10',
    subjectId: 'sbj-3',
    order: 3,
    title: 'Actividad 3: Ensayo Prospectivo sobre Organizaciones del Futuro',
    description: 'Redacción de un ensayo argumentativo de 4 páginas acerca de las estructuras holocráticas y el impacto de la automatización.',
    dueDate: '2026-05-20',
    weight: 40,
    type: 'Proyecto',
    status: 'Pendiente'
  },

  // Asignatura sbj-4: Contabilidad Financiera I
  {
    id: 'act-11',
    subjectId: 'sbj-4',
    order: 1,
    title: 'Actividad 1: Taller de Ecuación Patrimonial y Partida Doble',
    description: 'Registro de transacciones comerciales iniciales, cuentas T y verificación del balance de comprobación.',
    dueDate: '2026-04-02',
    weight: 30,
    type: 'Taller',
    status: 'Pendiente'
  },
  {
    id: 'act-12',
    subjectId: 'sbj-4',
    order: 2,
    title: 'Actividad 2: Taller de Conciliación Bancaria y Libros Auxiliares',
    description: 'Conciliación del extracto bancario con el libro auxiliar de bancos de una empresa comercial del sector retail.',
    dueDate: '2026-04-26',
    weight: 30,
    type: 'Tarea',
    status: 'Pendiente'
  },
  {
    id: 'act-13',
    subjectId: 'sbj-4',
    order: 3,
    title: 'Actividad 3: Proyecto de Balance General y Estado de Resultados',
    description: 'Elaboración completa del ciclo contable a 31 de diciembre con notas explicativas a los estados financieros.',
    dueDate: '2026-05-25',
    weight: 40,
    type: 'Proyecto',
    status: 'Pendiente'
  }
];


export const INITIAL_CENTRAL_ANNOUNCEMENT: CentralAnnouncement = {
  title: '¡Bienvenidos al Periodo Académico 2026!',
  content: 'Recuerden revisar sus horarios y ponerse en contacto con sus docentes asignados ante cualquier inquietud.',
  active: false,
};
