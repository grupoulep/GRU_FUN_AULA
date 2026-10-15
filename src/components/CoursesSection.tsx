import React, { useState } from 'react';
import { Course, Subject, Teacher, StudentAdmission, ProgramType } from '../types';
import {
  Edit2,
  Save,
  X,
  Plus,
  GraduationCap,
  Search,
  Trash2,
  Hash,
  BookOpen,
  Users,
  UserCheck,
  Award,
  Layers,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
  subjects?: Subject[];
  teachers?: Teacher[];
  students?: StudentAdmission[];
  onAddCourse: (course: Omit<Course, 'id'>, initialSubjects?: Omit<Subject, 'id'>[]) => void;
  onDeleteCourse: (id: string) => void;
  onUpdateCourse?: (course: Course) => void;
  onAddSubject?: (subject: Omit<Subject, 'id'>) => void;
  onUpdateSubject?: (subject: Subject) => void;
  onDeleteSubject?: (id: string) => void;
  onNavigateToSubjects?: () => void;
}

interface DraftSubject {
  id: string;
  name: string;
  code: string;
  credits: number;
  weeklyHours: number;
  professorId?: string;
  professor: string;
  professorCedula?: string;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  subjects = [],
  teachers = [],
  students = [],
  onAddCourse,
  onDeleteCourse,
  onUpdateCourse,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onNavigateToSubjects
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Técnico' | 'Curso'>('all');

  // Main Form State (Curso o Técnico)
  const [programType, setProgramType] = useState<ProgramType>('Técnico');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Draft subjects inside the main creation form
  const [draftSubjects, setDraftSubjects] = useState<DraftSubject[]>([]);
  const [draftName, setDraftName] = useState('');
  const [draftCode, setDraftCode] = useState('');
  const [draftCredits, setDraftCredits] = useState(3);
  const [draftWeeklyHours, setDraftWeeklyHours] = useState(4);
  const [draftTeacherId, setDraftTeacherId] = useState('');
  const [draftCustomProf, setDraftCustomProf] = useState('');
  const [showDraftSubjectForm, setShowDraftSubjectForm] = useState(false);

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editType, setEditType] = useState<ProgramType>('Técnico');
  const [editDuration, setEditDuration] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Course Subjects Detail & Quick Subject Creation Modal State
  const [selectedCourseForSubjects, setSelectedCourseForSubjects] = useState<Course | null>(null);
  const [isQuickSubjectOpen, setIsQuickSubjectOpen] = useState(false);
  const [quickSubName, setQuickSubName] = useState('');
  const [quickSubCode, setQuickSubCode] = useState('');
  const [quickSubCredits, setQuickSubCredits] = useState(3);
  const [quickSubWeeklyHours, setQuickSubWeeklyHours] = useState(4);
  const [quickSubTeacherId, setQuickSubTeacherId] = useState('');
  const [quickSubCustomProf, setQuickSubCustomProf] = useState('');

  // Edit Existing Subject inside Course View Modal
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editSubName, setEditSubName] = useState('');
  const [editSubCode, setEditSubCode] = useState('');
  const [editSubCredits, setEditSubCredits] = useState(3);
  const [editSubWeeklyHours, setEditSubWeeklyHours] = useState(4);
  const [editSubTeacherId, setEditSubTeacherId] = useState('');
  const [editSubCustomProf, setEditSubCustomProf] = useState('');

  // Helper to get subjects of a course
  const getCourseSubjects = (course: Course) => {
    return subjects.filter(
      (s) => s.courseId === course.id || (s.courseName && s.courseName.toLowerCase() === course.name.toLowerCase())
    );
  };

  // Helper to get teachers of a course
  const getCourseTeachers = (course: Course) => {
    return teachers.filter((t) => t.courseIds?.includes(course.id));
  };

  // Helper to get students of a course
  const getCourseStudents = (course: Course) => {
    return students.filter(
      (st) => st.courseId === course.id || (st.courseIds && st.courseIds.includes(course.id))
    );
  };

  // Auto-suggest code when program type or name changes
  const handleNameChange = (val: string) => {
    setName(val);
    if (!code || code.startsWith('TEC-') || code.startsWith('CUR-')) {
      const prefix = programType === 'Técnico' ? 'TEC' : 'CUR';
      const clean = val
        .trim()
        .split(' ')
        .filter((w) => w.length > 2)
        .slice(0, 3)
        .map((w) => w.substring(0, 3).toUpperCase())
        .join('-');
      if (clean) {
        setCode(`${prefix}-${clean}`);
      }
    }
  };

  // Add draft subject into pending list during course creation
  const handleAddDraftSubject = () => {
    if (!draftName.trim()) return;

    let profName = 'Docente por asignar';
    let profId: string | undefined = undefined;
    let profCedula: string | undefined = undefined;

    if (draftTeacherId === 'custom') {
      profName = draftCustomProf.trim() || 'Docente por asignar';
    } else if (draftTeacherId) {
      const tch = teachers.find((t) => t.id === draftTeacherId);
      if (tch) {
        profName = tch.fullName;
        profId = tch.id;
        profCedula = tch.cedula;
      }
    }

    const subCode = draftCode.trim()
      ? draftCode.trim().toUpperCase()
      : `${code || 'MAT'}-M${draftSubjects.length + 1}`;

    const newDraft: DraftSubject = {
      id: `draft-${Date.now()}-${Math.random()}`,
      name: draftName.trim(),
      code: subCode,
      credits: Number(draftCredits) || 3,
      weeklyHours: Number(draftWeeklyHours) || 4,
      professor: profName,
      professorId: profId,
      professorCedula: profCedula
    };

    setDraftSubjects((prev) => [...prev, newDraft]);

    // Reset draft form
    setDraftName('');
    setDraftCode('');
    setDraftCredits(3);
    setDraftWeeklyHours(4);
    setDraftTeacherId('');
    setDraftCustomProf('');
    setShowDraftSubjectForm(false);
  };

  const handleRemoveDraftSubject = (id: string) => {
    setDraftSubjects((prev) => prev.filter((d) => d.id !== id));
  };

  // Submit Main Unified Form
  const handleSubmitMainForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const initialSubjectsList: Omit<Subject, 'id'>[] = draftSubjects.map((d) => ({
      name: d.name,
      code: d.code,
      credits: d.credits,
      weeklyHours: d.weeklyHours,
      courseId: '', // Filled in App.tsx handleAddCourse
      courseName: name.trim(),
      professor: d.professor,
      professorId: d.professorId,
      professorCedula: d.professorCedula
    }));

    onAddCourse(
      {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        programType,
        duration: duration.trim() || (programType === 'Técnico' ? '3 Semestres' : '40 Horas'),
        description: description.trim()
      },
      initialSubjectsList
    );

    // Reset form
    setName('');
    setCode('');
    setDuration('');
    setDescription('');
    setDraftSubjects([]);
    setShowForm(false);
    const subCount = initialSubjectsList.length;
    setSuccessMessage(
      `¡${programType} creado exitosamente!${subCount > 0 ? ` Se crearon ${subCount} materias asociadas.` : ''}`
    );
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  // Open Quick Subject Creation for a selected course
  const handleOpenQuickSubjectModal = (course: Course) => {
    setSelectedCourseForSubjects(course);
    const existing = getCourseSubjects(course);
    setQuickSubName('');
    setQuickSubCode(`${course.code}-M${existing.length + 1}`);
    setQuickSubCredits(3);
    setQuickSubWeeklyHours(4);
    setQuickSubTeacherId('');
    setQuickSubCustomProf('');
    setIsQuickSubjectOpen(true);
  };

  // Save Quick Subject
  const handleSaveQuickSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForSubjects || !quickSubName.trim() || !quickSubCode.trim() || !onAddSubject) return;

    let profName = 'Docente por asignar';
    let profId: string | undefined = undefined;
    let profCedula: string | undefined = undefined;

    if (quickSubTeacherId === 'custom') {
      profName = quickSubCustomProf.trim() || 'Docente por asignar';
    } else if (quickSubTeacherId) {
      const tch = teachers.find((t) => t.id === quickSubTeacherId);
      if (tch) {
        profName = tch.fullName;
        profId = tch.id;
        profCedula = tch.cedula;
      }
    }

    onAddSubject({
      name: quickSubName.trim(),
      code: quickSubCode.trim().toUpperCase(),
      credits: Number(quickSubCredits) || 3,
      weeklyHours: Number(quickSubWeeklyHours) || 4,
      courseId: selectedCourseForSubjects.id,
      courseName: selectedCourseForSubjects.name,
      professor: profName,
      professorId: profId,
      professorCedula: profCedula
    });

    setIsQuickSubjectOpen(false);
    setSuccessMessage(`¡Materia "${quickSubName.trim()}" agregada con éxito a ${selectedCourseForSubjects.name}!`);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  // Edit Course handlers
  const handleStartEditCourse = (course: Course) => {
    setEditingCourse(course);
    setEditName(course.name);
    setEditCode(course.code);
    setEditType(course.programType || (course.name.toLowerCase().includes('técnico') ? 'Técnico' : 'Curso'));
    setEditDuration(course.duration || '');
    setEditDescription(course.description || '');
  };

  const handleSaveEditCourse = () => {
    if (editingCourse && editName.trim() && editCode.trim() && onUpdateCourse) {
      onUpdateCourse({
        ...editingCourse,
        name: editName.trim(),
        code: editCode.trim().toUpperCase(),
        programType: editType,
        duration: editDuration.trim(),
        description: editDescription.trim()
      });
      setEditingCourse(null);
      setSuccessMessage('¡Programa actualizado exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };

  // Edit existing subject handlers
  const handleStartEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setEditSubName(subject.name);
    setEditSubCode(subject.code);
    setEditSubCredits(subject.credits);
    setEditSubWeeklyHours(subject.weeklyHours);

    const tch = teachers.find(
      (t) => t.id === subject.professorId || t.cedula === subject.professorCedula || t.fullName === subject.professor
    );
    if (tch) {
      setEditSubTeacherId(tch.id);
      setEditSubCustomProf('');
    } else if (subject.professor && subject.professor !== 'Docente por asignar') {
      setEditSubTeacherId('custom');
      setEditSubCustomProf(subject.professor);
    } else {
      setEditSubTeacherId('');
      setEditSubCustomProf('');
    }
  };

  const handleSaveEditSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editSubName.trim() || !editSubCode.trim() || !onUpdateSubject) return;

    let profName = 'Docente por asignar';
    let profId: string | undefined = undefined;
    let profCedula: string | undefined = undefined;

    if (editSubTeacherId === 'custom') {
      profName = editSubCustomProf.trim() || 'Docente por asignar';
    } else if (editSubTeacherId) {
      const tch = teachers.find((t) => t.id === editSubTeacherId);
      if (tch) {
        profName = tch.fullName;
        profId = tch.id;
        profCedula = tch.cedula;
      }
    }

    onUpdateSubject({
      ...editingSubject,
      name: editSubName.trim(),
      code: editSubCode.trim().toUpperCase(),
      credits: Number(editSubCredits) || 3,
      weeklyHours: Number(editSubWeeklyHours) || 4,
      professor: profName,
      professorId: profId,
      professorCedula: profCedula
    });

    setEditingSubject(null);
    setSuccessMessage('¡Materia actualizada exitosamente!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  // Filtering
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());

    const isTecnico = c.programType === 'Técnico' || c.name.toLowerCase().includes('técnico');
    if (filterType === 'Técnico') return matchesSearch && isTecnico;
    if (filterType === 'Curso') return matchesSearch && !isTecnico;
    return matchesSearch;
  });

  const countTecnicos = courses.filter((c) => c.programType === 'Técnico' || c.name.toLowerCase().includes('técnico')).length;
  const countCursos = courses.length - countTecnicos;

  return (
    <div id="courses-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            id="courses-title"
            className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span>Crear Curso o Técnico</span>
          </h2>
          <p id="courses-subtitle" className="text-sm text-slate-500 mt-1">
            Gestión unificada de programas formativos (Cursos y Carreras Técnicas) y creación directa de sus materias asociadas.
          </p>
        </div>

        <button
          id="btn-toggle-new-course"
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              <span>Cerrar Formulario</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Nuevo Curso o Técnico</span>
            </>
          )}
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div
          id="course-success-alert"
          role="status"
          className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* UNIFIED CREATION FORM: CURSO O TÉCNICO + MATERIAS INTEGRADAS */}
      {showForm && (
        <section
          id="new-course-form-card"
          className="bg-white border-2 border-blue-500/30 rounded-2xl p-5 sm:p-7 shadow-lg transition-all space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Registro Unificado de Programa Formativo</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configura el programa y crea sus materias directamente en este mismo formulario.
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Creación Integral
            </span>
          </div>

          <form onSubmit={handleSubmitMainForm} className="space-y-6">
            {/* Step 1: Select Type (Técnico vs Curso) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                1. Selecciona el Tipo de Programa *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProgramType('Técnico');
                    if (!duration) setDuration('3 Semestres');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    programType === 'Técnico'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      programType === 'Técnico' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">Programa Técnico</span>
                      {programType === 'Técnico' && (
                        <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                          Seleccionado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Carrera técnica laboral, ciclo formativo de varios semestres o módulos de formación laboral.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProgramType('Curso');
                    if (!duration) setDuration('40 Horas');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    programType === 'Curso'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      programType === 'Curso' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">Curso o Diplomado</span>
                      {programType === 'Curso' && (
                        <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                          Seleccionado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Curso de capacitación continua, taller práctico, seminario o diplomado especializado.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Basic Info */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                2. Datos Principales del {programType} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="course-code-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Código Identificador *
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="course-code-input"
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder={programType === 'Técnico' ? 'Ej: TEC-SIS-01' : 'Ej: CUR-EXC-01'}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase font-mono font-bold"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Código clave para búsqueda y vinculación
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="course-name-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Nombre del {programType} *
                  </label>
                  <input
                    id="course-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder={
                      programType === 'Técnico'
                        ? 'Ej: Técnico Laboral en Sistemas e Informática'
                        : 'Ej: Curso Especializado en Excel Financiero y Dashboards'
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Título formal que aparecerá en matrículas y certificados
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label htmlFor="course-duration-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Duración Estimada
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="course-duration-input"
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder={programType === 'Técnico' ? 'Ej: 3 Semestres (1,200 horas)' : 'Ej: 40 Horas / 4 Semanas'}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="course-desc-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Descripción / Enfoque (Opcional)
                  </label>
                  <input
                    id="course-desc-input"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Formación con énfasis en programación web, soporte técnico y redes..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: DIRECT SUBJECT CREATION INSIDE THIS PROGRAM */}
            <div className="p-4 sm:p-5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      3. Materias del {programType} (Creación Directa)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-200 text-blue-800">
                      {draftSubjects.length} agregadas
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Define aquí mismo las materias que componen este {programType}. Se registrarán automáticamente al guardar.
                  </p>
                </div>

                {!showDraftSubjectForm && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDraftSubjectForm(true);
                      setDraftCode(`${code || 'MAT'}-M${draftSubjects.length + 1}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Agregar Materia a este {programType}</span>
                  </button>
                )}
              </div>

              {/* List of drafted subjects for this course */}
              {draftSubjects.length > 0 ? (
                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {draftSubjects.map((sub, idx) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-lg border border-blue-200 bg-white shadow-2xs flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                              {sub.code}
                            </span>
                            <span className="text-[11px] font-bold text-slate-800 truncate" title={sub.name}>
                              {idx + 1}. {sub.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            <span>{sub.credits} créditos</span>
                            <span>•</span>
                            <span>{sub.weeklyHours} hrs/sem</span>
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium truncate mt-0.5">
                            Docente: {sub.professor}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveDraftSubject(sub.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                          title="Quitar materia de la lista"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                !showDraftSubjectForm && (
                  <div className="py-4 text-center border border-dashed border-blue-200 rounded-lg bg-white/60 text-xs text-slate-500">
                    Aún no has agregado materias en este formulario. Haz clic en{' '}
                    <strong className="text-blue-700">+ Agregar Materia a este {programType}</strong> o agrégalas más tarde desde la tarjeta del programa.
                  </div>
                )
              )}

              {/* Sub-form to add a materia right here */}
              {showDraftSubjectForm && (
                <div className="p-4 rounded-xl border border-blue-300 bg-white shadow-xs space-y-3 mt-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Nueva Materia para {name || `este ${programType}`}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDraftSubjectForm(false)}
                      className="text-slate-400 hover:text-slate-700 text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                        Código de Materia *
                      </label>
                      <input
                        type="text"
                        value={draftCode}
                        onChange={(e) => setDraftCode(e.target.value.toUpperCase())}
                        placeholder="Ej: TEC-SIS-M1"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                        Nombre de la Materia *
                      </label>
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder="Ej: Algoritmos y Fundamentos de Programación"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                        Créditos Académicos
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={draftCredits}
                        onChange={(e) => setDraftCredits(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                        Horas Semanales
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={draftWeeklyHours}
                        onChange={(e) => setDraftWeeklyHours(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                        Docente Asignado
                      </label>
                      <select
                        value={draftTeacherId}
                        onChange={(e) => setDraftTeacherId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="">-- Por asignar --</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.fullName} (C.C. {t.cedula})
                          </option>
                        ))}
                        <option value="custom">Otro docente (escribir nombre)...</option>
                      </select>
                    </div>
                  </div>

                  {draftTeacherId === 'custom' && (
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                        Nombre completo del docente
                      </label>
                      <input
                        type="text"
                        value={draftCustomProf}
                        onChange={(e) => setDraftCustomProf(e.target.value)}
                        placeholder="Ej: Lic. Carlos Andrés Gómez"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowDraftSubjectForm(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleAddDraftSubject}
                      disabled={!draftName.trim()}
                      className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar a la lista del {programType}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Se guardará el <strong>{programType}</strong>
                {draftSubjects.length > 0 ? (
                  <> y se crearán automáticamente <strong>{draftSubjects.length} materias</strong> asociadas.</>
                ) : (
                  <> (podrás crear materias en cualquier momento).</>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-submit-course"
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-500 text-white text-xs font-bold hover:from-blue-800 hover:to-teal-600 cursor-pointer inline-flex items-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    Guardar {programType}
                    {draftSubjects.length > 0 && ` con ${draftSubjects.length} Materias`}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>Todos los Programas</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  filterType === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {courses.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('Técnico')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'Técnico'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Técnicos</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  filterType === 'Técnico' ? 'bg-white/20 text-white' : 'bg-emerald-200/80 text-emerald-900'
                }`}
              >
                {countTecnicos}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('Curso')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'Curso'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cursos y Diplomados</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  filterType === 'Curso' ? 'bg-white/20 text-white' : 'bg-blue-200/80 text-blue-900'
                }`}
              >
                {countCursos}
              </span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="search-courses-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código o nombre..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* COURSES & TÉCNICOS CARDS GRID */}
        {filteredCourses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No se encontraron cursos o programas técnicos con los filtros actuales.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const courseSubjects = getCourseSubjects(course);
              const courseTeachers = getCourseTeachers(course);
              const courseStudents = getCourseStudents(course);
              const isTecnico = course.programType === 'Técnico' || course.name.toLowerCase().includes('técnico');

              return (
                <div
                  key={course.id}
                  id={`course-card-${course.id}`}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  {/* Top info */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                            isTecnico
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {isTecnico ? 'TÉCNICO' : 'CURSO'}
                        </span>
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white">
                          {course.code}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {onUpdateCourse && (
                          <button
                            type="button"
                            onClick={() => handleStartEditCourse(course)}
                            className="p-1.5 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Editar programa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          id={`btn-delete-course-${course.id}`}
                          type="button"
                          onClick={() => onDeleteCourse(course.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar curso"
                          aria-label={`Eliminar curso ${course.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4
                      className="font-bold text-slate-900 text-base leading-snug line-clamp-2"
                      title={course.name}
                    >
                      {course.name}
                    </h4>

                    {course.duration && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{course.duration}</span>
                      </div>
                    )}

                    {course.description && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Connected stats */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-1.5 rounded-lg bg-purple-50/60 border border-purple-100">
                      <span className="block font-bold text-purple-900 text-xs">{courseSubjects.length}</span>
                      <span className="text-purple-700 text-[10px]">Materias</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-blue-50/60 border border-blue-100">
                      <span className="block font-bold text-blue-900 text-xs">{courseTeachers.length}</span>
                      <span className="text-blue-700 text-[10px]">Docentes</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <span className="block font-bold text-emerald-900 text-xs">{courseStudents.length}</span>
                      <span className="text-emerald-700 text-[10px]">Alumnos</span>
                    </div>
                  </div>

                  {/* DIRECT ACTIONS: CREATE MATERIA FOR THIS COURSE & MANAGE MATERIAS */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleOpenQuickSubjectModal(course)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Crear Materia para este {isTecnico ? 'Técnico' : 'Curso'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCourseForSubjects(course)}
                      className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver Materias del Pénsum ({courseSubjects.length})</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK MATERIA CREATION MODAL FOR SELECTED COURSE */}
      {isQuickSubjectOpen && selectedCourseForSubjects && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Crear Materia dentro del Programa
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Se asociará directamente al curso o técnico seleccionado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickSubjectOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Course Highlight */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programa Destino
                </span>
                <div className="font-bold text-xs text-slate-900 truncate">
                  {selectedCourseForSubjects.name}
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white shrink-0">
                {selectedCourseForSubjects.code}
              </span>
            </div>

            <form onSubmit={handleSaveQuickSubject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Código de Materia *
                  </label>
                  <input
                    type="text"
                    required
                    value={quickSubCode}
                    onChange={(e) => setQuickSubCode(e.target.value.toUpperCase())}
                    placeholder="Ej: TEC-SIS-M1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nombre de la Materia *
                  </label>
                  <input
                    type="text"
                    required
                    value={quickSubName}
                    onChange={(e) => setQuickSubName(e.target.value)}
                    placeholder="Ej: Base de Datos y Modelamiento"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Créditos Académicos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quickSubCredits}
                    onChange={(e) => setQuickSubCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Horas Semanales
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={quickSubWeeklyHours}
                    onChange={(e) => setQuickSubWeeklyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Docente Asignado
                  </label>
                  <select
                    value={quickSubTeacherId}
                    onChange={(e) => setQuickSubTeacherId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">-- Por asignar --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} (C.C. {t.cedula})
                      </option>
                    ))}
                    <option value="custom">Otro docente (escribir)...</option>
                  </select>
                </div>
              </div>

              {quickSubTeacherId === 'custom' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nombre del Docente
                  </label>
                  <input
                    type="text"
                    value={quickSubCustomProf}
                    onChange={(e) => setQuickSubCustomProf(e.target.value)}
                    placeholder="Ej: Lic. Andrés Parra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickSubjectOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Guardar Materia en este Curso</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL: VIEW & MANAGE ALL MATERIAS OF A COURSE */}
      {selectedCourseForSubjects && !isQuickSubjectOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">
                      Materias del Programa
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                      {selectedCourseForSubjects.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {selectedCourseForSubjects.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourseForSubjects(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Pénsum de Materias Registradas ({getCourseSubjects(selectedCourseForSubjects).length})
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenQuickSubjectModal(selectedCourseForSubjects)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Crear Nueva Materia</span>
                </button>
              </div>

              {getCourseSubjects(selectedCourseForSubjects).length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs space-y-2">
                  <p>Este programa aún no tiene materias creadas.</p>
                  <button
                    type="button"
                    onClick={() => handleOpenQuickSubjectModal(selectedCourseForSubjects)}
                    className="px-3 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Crear la primera materia ahora</span>
                  </button>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {getCourseSubjects(selectedCourseForSubjects).map((sub, idx) => (
                    <div
                      key={sub.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 border border-purple-200">
                            {sub.code}
                          </span>
                          <span className="font-bold text-xs text-slate-900">
                            {idx + 1}. {sub.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                          <span>{sub.credits} Créditos</span>
                          <span>•</span>
                          <span>{sub.weeklyHours} Horas semanales</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">
                            Docente: <strong>{sub.professor}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-center">
                        {onUpdateSubject && (
                          <button
                            type="button"
                            onClick={() => handleStartEditSubject(sub)}
                            className="p-1.5 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Editar materia"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteSubject && (
                          <button
                            type="button"
                            onClick={() => onDeleteSubject(sub.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Eliminar materia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              {onNavigateToSubjects && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseForSubjects(null);
                    onNavigateToSubjects();
                  }}
                  className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Ir a Vista Global de Materias</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedCourseForSubjects(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer ml-auto"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT COURSE / TÉCNICO MODAL */}
      {editingCourse && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-700" />
                <span>Editar {editType}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Tipo de Programa</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditType('Técnico')}
                    className={`py-1.5 rounded-lg border text-xs font-bold ${
                      editType === 'Técnico' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Técnico
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType('Curso')}
                    className={`py-1.5 rounded-lg border text-xs font-bold ${
                      editType === 'Curso' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Curso
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Código de Búsqueda</label>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nombre del Programa</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Duración</label>
                <input
                  type="text"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  placeholder="Ej: 3 Semestres"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEditCourse}
                className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT EXISTING SUBJECT MODAL */}
      {editingSubject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-700" />
                <span>Editar Materia</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Código de Materia</label>
                <input
                  type="text"
                  required
                  value={editSubCode}
                  onChange={(e) => setEditSubCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nombre de la Materia</label>
                <input
                  type="text"
                  required
                  value={editSubName}
                  onChange={(e) => setEditSubName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Créditos</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editSubCredits}
                    onChange={(e) => setEditSubCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Horas Semanales</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={editSubWeeklyHours}
                    onChange={(e) => setEditSubWeeklyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Docente Asignado</label>
                <select
                  value={editSubTeacherId}
                  onChange={(e) => setEditSubTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                >
                  <option value="">-- Por asignar --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} (C.C. {t.cedula})
                    </option>
                  ))}
                  <option value="custom">Otro docente...</option>
                </select>
              </div>

              {editSubTeacherId === 'custom' && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nombre del Docente</label>
                  <input
                    type="text"
                    value={editSubCustomProf}
                    onChange={(e) => setEditSubCustomProf(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
