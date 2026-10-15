import React, { useState } from 'react';
import { Subject, Course, Teacher } from '../types';
import {
  Plus,
  BookOpen,
  Search,
  Trash2,
  Clock,
  User,
  Award,
  Edit2,
  Save,
  X,
  CheckCircle2,
  GraduationCap,
  Layers,
  ChevronRight,
  Filter,
  PlusCircle,
  FolderPlus,
  Hash
} from 'lucide-react';

interface SubjectsSectionProps {
  subjects: Subject[];
  courses: Course[];
  teachers?: Teacher[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onDeleteSubject: (id: string) => void;
  onUpdateSubject?: (subject: Subject) => void;
  onNavigateToCourses?: () => void;
}

export const SubjectsSection: React.FC<SubjectsSectionProps> = ({
  subjects,
  courses,
  teachers = [],
  onAddSubject,
  onDeleteSubject,
  onUpdateSubject,
  onNavigateToCourses
}) => {
  // Main view mode: 'by-course' (Organized by Curso/Técnico) or 'table' (Flat List)
  const [viewMode, setViewMode] = useState<'by-course' | 'table'>('by-course');
  const [programFilter, setProgramFilter] = useState<'all' | 'Técnico' | 'Curso'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGlobalForm, setShowGlobalForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Global Add Form State
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [credits, setCredits] = useState(3);
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [customProfessor, setCustomProfessor] = useState('');

  // Dedicated "Add Subject to Specific Course" Modal State
  const [quickTargetCourse, setQuickTargetCourse] = useState<Course | null>(null);
  const [quickSubName, setQuickSubName] = useState('');
  const [quickSubCode, setQuickSubCode] = useState('');
  const [quickSubCredits, setQuickSubCredits] = useState(3);
  const [quickSubHours, setQuickSubHours] = useState(4);
  const [quickSubTeacherId, setQuickSubTeacherId] = useState('');
  const [quickSubCustomProf, setQuickSubCustomProf] = useState('');

  // Edit Subject Modal State
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editCredits, setEditCredits] = useState(3);
  const [editCourseId, setEditCourseId] = useState('');
  const [editTeacherId, setEditTeacherId] = useState('');
  const [editCustomProf, setEditCustomProf] = useState('');
  const [editWeeklyHours, setEditWeeklyHours] = useState(4);

  // Helper to get subjects of a given course
  const getSubjectsForCourse = (course: Course) => {
    return subjects.filter(
      (s) =>
        s.courseId === course.id ||
        (s.courseName && s.courseName.toLowerCase() === course.name.toLowerCase())
    );
  };

  // Helper to resolve professor info
  const resolveProfessorInfo = (teacherId: string, customText: string) => {
    if (teacherId === 'custom') {
      return {
        name: customText.trim() || 'Docente por asignar',
        id: undefined,
        cedula: undefined
      };
    }
    if (teacherId) {
      const tch = teachers.find((t) => t.id === teacherId);
      if (tch) {
        return {
          name: tch.fullName,
          id: tch.id,
          cedula: tch.cedula
        };
      }
    }
    if (customText.trim()) {
      return {
        name: customText.trim(),
        id: undefined,
        cedula: undefined
      };
    }
    return {
      name: 'Docente por asignar',
      id: undefined,
      cedula: undefined
    };
  };

  // Open Quick Modal to add subject to a specific course
  const handleOpenAddForCourse = (course: Course) => {
    setQuickTargetCourse(course);
    const existing = getSubjectsForCourse(course);
    setQuickSubName('');
    setQuickSubCode(`${course.code}-M${existing.length + 1}`);
    setQuickSubCredits(3);
    setQuickSubHours(4);
    setQuickSubTeacherId('');
    setQuickSubCustomProf('');
  };

  // Save subject from Quick Modal
  const handleSaveQuickSubject = (keepOpenForAnother = false) => {
    if (!quickTargetCourse || !quickSubName.trim() || !quickSubCode.trim()) return;

    const prof = resolveProfessorInfo(quickSubTeacherId, quickSubCustomProf);

    onAddSubject({
      name: quickSubName.trim(),
      code: quickSubCode.trim().toUpperCase(),
      credits: Number(quickSubCredits) || 3,
      courseId: quickTargetCourse.id,
      courseName: quickTargetCourse.name,
      professor: prof.name,
      professorId: prof.id,
      professorCedula: prof.cedula,
      weeklyHours: Number(quickSubHours) || 4
    });

    const isTecnico =
      quickTargetCourse.programType === 'Técnico' ||
      quickTargetCourse.name.toLowerCase().includes('técnico');

    if (keepOpenForAnother) {
      const currentCount = getSubjectsForCourse(quickTargetCourse).length + 1;
      setQuickSubName('');
      setQuickSubCode(`${quickTargetCourse.code}-M${currentCount + 1}`);
      setSuccessMessage(
        `¡Materia agregada a ${quickTargetCourse.name}! Puedes ingresar la siguiente.`
      );
    } else {
      setQuickTargetCourse(null);
      setSuccessMessage(
        `¡Materia agregada con éxito al ${isTecnico ? 'Técnico' : 'Curso'} ${quickTargetCourse.name}!`
      );
    }
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // When changing course in global form, auto-suggest code prefix
  const handleCourseSelectionChange = (cId: string) => {
    setSelectedCourseId(cId);
    const c = courses.find((item) => item.id === cId);
    if (c) {
      const existing = getSubjectsForCourse(c);
      setSubjectCode(`${c.code}-M${existing.length + 1}`);
    }
  };

  // Submit Global Add Form
  const handleSubmitGlobalForm = (e: React.FormEvent, keepAdding = false) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectCode.trim()) return;

    const targetCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
    const targetCourseId = targetCourse ? targetCourse.id : 'general';
    const courseName = targetCourse ? targetCourse.name : 'General';

    const prof = resolveProfessorInfo(selectedTeacherId, customProfessor);

    onAddSubject({
      name: subjectName.trim(),
      code: subjectCode.trim().toUpperCase(),
      credits: Number(credits) || 3,
      courseId: targetCourseId,
      courseName,
      professor: prof.name,
      professorId: prof.id,
      professorCedula: prof.cedula,
      weeklyHours: Number(weeklyHours) || 4
    });

    if (keepAdding && targetCourse) {
      const nextCount = getSubjectsForCourse(targetCourse).length + 2;
      setSubjectName('');
      setSubjectCode(`${targetCourse.code}-M${nextCount}`);
      setSuccessMessage(
        `¡Materia guardada en ${courseName}! Puedes continuar agregando otra al mismo programa.`
      );
    } else {
      setSubjectName('');
      setSubjectCode('');
      setSelectedTeacherId('');
      setCustomProfessor('');
      setShowGlobalForm(false);
      setSuccessMessage(`¡Materia guardada exitosamente en ${courseName}!`);
    }
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Edit Handlers
  const handleStartEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setEditCode(subject.code);
    setEditCredits(subject.credits);
    setEditCourseId(subject.courseId || courses[0]?.id || '');
    setEditWeeklyHours(subject.weeklyHours);

    const matchedTch = teachers.find(
      (t) =>
        t.id === subject.professorId ||
        t.cedula === subject.professorCedula ||
        t.fullName === subject.professor
    );
    if (matchedTch) {
      setEditTeacherId(matchedTch.id);
      setEditCustomProf('');
    } else if (subject.professor && subject.professor !== 'Docente por asignar') {
      setEditTeacherId('custom');
      setEditCustomProf(subject.professor);
    } else {
      setEditTeacherId('');
      setEditCustomProf('');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editName.trim() || !editCode.trim() || !onUpdateSubject) return;

    const matchedCourse = courses.find((c) => c.id === editCourseId);
    const courseName = matchedCourse ? matchedCourse.name : 'General';
    const prof = resolveProfessorInfo(editTeacherId, editCustomProf);

    onUpdateSubject({
      id: editingSubject.id,
      name: editName.trim(),
      code: editCode.trim().toUpperCase(),
      credits: Number(editCredits) || 3,
      courseId: editCourseId,
      courseName,
      professor: prof.name,
      professorId: prof.id,
      professorCedula: prof.cedula,
      weeklyHours: Number(editWeeklyHours) || 4
    });

    setEditingSubject(null);
    setSuccessMessage('¡Materia actualizada exitosamente!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  // Filtered courses based on filterType and search
  const filteredCourses = courses.filter((c) => {
    const isTecnico = c.programType === 'Técnico' || c.name.toLowerCase().includes('técnico');
    if (programFilter === 'Técnico' && !isTecnico) return false;
    if (programFilter === 'Curso' && isTecnico) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    // Matches course name or code
    if (c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)) return true;

    // Or matches any of its subjects
    const cSubs = getSubjectsForCourse(c);
    return cSubs.some(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        s.professor.toLowerCase().includes(term)
    );
  });

  // Flat list filtered subjects
  const filteredFlatSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.courseName && s.courseName.toLowerCase().includes(searchTerm.toLowerCase()));

    const parentCourse = courses.find((c) => c.id === s.courseId);
    const isTecnico =
      parentCourse?.programType === 'Técnico' ||
      parentCourse?.name.toLowerCase().includes('técnico') ||
      s.courseName?.toLowerCase().includes('técnico');

    if (programFilter === 'Técnico') return matchesSearch && isTecnico;
    if (programFilter === 'Curso') return matchesSearch && !isTecnico;
    return matchesSearch;
  });

  // Subjects without course (orphans if any)
  const orphanSubjects = subjects.filter(
    (s) => !courses.some((c) => c.id === s.courseId)
  );

  const countTecnicos = courses.filter(
    (c) => c.programType === 'Técnico' || c.name.toLowerCase().includes('técnico')
  ).length;
  const countCursos = courses.length - countTecnicos;

  return (
    <div id="subjects-section-container" className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 to-sky-500 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Materias por Curso o Técnico</span>
              </h1>
              <p className="text-xs text-slate-500">
                Agrega, organiza y gestiona el pénsum de asignaturas vinculadas a cada programa formativo.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToCourses && (
            <button
              type="button"
              onClick={onNavigateToCourses}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer transition-all"
            >
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <span>Ver Cursos / Técnicos</span>
            </button>
          )}

          <button
            id="btn-new-subject"
            type="button"
            onClick={() => {
              setShowGlobalForm(!showGlobalForm);
              if (!selectedCourseId && courses.length > 0) {
                handleCourseSelectionChange(courses[0].id);
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-900 to-sky-500 hover:from-blue-800 hover:to-sky-400 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            {showGlobalForm ? (
              <>
                <X className="w-4 h-4" />
                <span>Cerrar Registro</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>+ Agregar Nueva Materia</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div
          role="status"
          className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-150"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total Materias</span>
          <span className="text-xl font-bold text-slate-900">{subjects.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">En toda la institución</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Técnicos con Pénsum</span>
          <span className="text-xl font-bold text-emerald-700">{countTecnicos}</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Programas laborales</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Cursos con Pénsum</span>
          <span className="text-xl font-bold text-blue-700">{countCursos}</span>
          <span className="text-[10px] text-blue-600 block mt-0.5">Cursos y diplomados</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Docentes en Materias</span>
          <span className="text-xl font-bold text-purple-700">
            {new Set(subjects.map((s) => s.professorId || s.professor).filter(Boolean)).size}
          </span>
          <span className="text-[10px] text-purple-600 block mt-0.5">Docentes vinculados</span>
        </div>
      </div>

      {/* GLOBAL ADD SUBJECT FORM (With clear Curso / Técnico picker) */}
      {showGlobalForm && (
        <section
          id="add-subject-panel"
          className="bg-white border-2 border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-md animate-in fade-in duration-200 space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-700" />
                <span>Agregar Materia a un Curso o Técnico</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Selecciona el programa de destino y completa los datos de la asignatura.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowGlobalForm(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={(e) => handleSubmitGlobalForm(e, false)} className="space-y-4">
            {/* Step 1: Destination Course or Técnico */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
              <label htmlFor="global-course-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Selecciona el Curso o Técnico de Destino *
              </label>
              <select
                id="global-course-select"
                value={selectedCourseId}
                onChange={(e) => handleCourseSelectionChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {courses.map((c) => {
                  const isTecnico = c.programType === 'Técnico' || c.name.toLowerCase().includes('técnico');
                  const count = getSubjectsForCourse(c).length;
                  return (
                    <option key={c.id} value={c.id}>
                      [{isTecnico ? 'TÉCNICO' : 'CURSO'}] {c.name} ({c.code}) — {count} materias registradas
                    </option>
                  );
                })}
              </select>

              {/* Course Highlight Info */}
              {selectedCourseId && (
                (() => {
                  const currentCourse = courses.find((c) => c.id === selectedCourseId);
                  if (!currentCourse) return null;
                  const isTec = currentCourse.programType === 'Técnico' || currentCourse.name.toLowerCase().includes('técnico');
                  const existingSubs = getSubjectsForCourse(currentCourse);
                  return (
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] font-mono ${isTec ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                        {isTec ? 'Programa Técnico Laboral' : 'Curso / Diplomado'}
                      </span>
                      {currentCourse.duration && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{currentCourse.duration}</span>
                        </span>
                      )}
                      <span className="text-slate-500">
                        Pénsum actual: <strong>{existingSubs.length} materias</strong>
                      </span>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Step 2: Subject Details */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Datos de la Asignatura
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="global-subject-code" className="block text-xs font-medium text-slate-700 mb-1">
                    Código de la Materia *
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="global-subject-code"
                      type="text"
                      required
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                      placeholder="Ej: TEC-SIS-M01"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="global-subject-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Nombre de la Asignatura *
                  </label>
                  <input
                    id="global-subject-name"
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="Ej: Arquitectura de Redes y Telecomunicaciones"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="global-subject-credits" className="block text-xs font-medium text-slate-700 mb-1">
                    Créditos Académicos
                  </label>
                  <input
                    id="global-subject-credits"
                    type="number"
                    min="1"
                    max="12"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="global-subject-hours" className="block text-xs font-medium text-slate-700 mb-1">
                    Horas Semanales
                  </label>
                  <input
                    id="global-subject-hours"
                    type="number"
                    min="1"
                    max="40"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="global-subject-teacher" className="block text-xs font-medium text-slate-700 mb-1">
                    Docente Asignado
                  </label>
                  <select
                    id="global-subject-teacher"
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="">Por Asignar (Sin docente)</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} (C.C. {t.cedula})
                      </option>
                    ))}
                    <option value="custom">Otro (Escribir nombre manual)</option>
                  </select>
                </div>
              </div>

              {selectedTeacherId === 'custom' && (
                <div>
                  <label htmlFor="global-subject-custom-prof" className="block text-xs font-medium text-slate-700 mb-1">
                    Nombre Completo del Docente
                  </label>
                  <input
                    id="global-subject-custom-prof"
                    type="text"
                    value={customProfessor}
                    onChange={(e) => setCustomProfessor(e.target.value)}
                    placeholder="Ej: Lic. Hernán Cortés"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Se agregará la materia vinculada al curso o técnico seleccionado.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGlobalForm(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmitGlobalForm(e, true)}
                  className="px-4 py-2 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold cursor-pointer transition-colors"
                >
                  Guardar y Agregar Otra
                </button>
                <button
                  id="btn-submit-subject"
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-900 to-sky-500 hover:from-blue-800 hover:to-sky-400 text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Guardar Materia
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* FILTER & VIEW CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* View mode toggle: Por Curso/Técnico vs Tabla General */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setViewMode('by-course')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'by-course'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Organizado por Curso / Técnico</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lista General de Materias</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="search-subjects-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar materia, código o docente..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filtro:</span>
          </span>

          <button
            type="button"
            onClick={() => setProgramFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              programFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todos ({courses.length})
          </button>

          <button
            type="button"
            onClick={() => setProgramFilter('Técnico')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              programFilter === 'Técnico'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Solo Técnicos ({countTecnicos})</span>
          </button>

          <button
            type="button"
            onClick={() => setProgramFilter('Curso')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              programFilter === 'Curso'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Solo Cursos ({countCursos})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ORGANIZED BY CURSO O TÉCNICO (DEFAULT & PRIMARY) */}
      {viewMode === 'by-course' && (
        <div id="subjects-by-course-container" className="space-y-5">
          {filteredCourses.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
              No se encontraron cursos o técnicos que coincidan con la búsqueda.
            </div>
          ) : (
            filteredCourses.map((course) => {
              const courseSubs = getSubjectsForCourse(course);
              const isTecnico =
                course.programType === 'Técnico' || course.name.toLowerCase().includes('técnico');
              const totalCredits = courseSubs.reduce((acc, s) => acc + (s.credits || 0), 0);
              const totalHours = courseSubs.reduce((acc, s) => acc + (s.weeklyHours || 0), 0);

              return (
                <div
                  key={course.id}
                  id={`course-subjects-card-${course.id}`}
                  className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Course Header Banner */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded font-mono ${
                            isTecnico
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {isTecnico ? 'TÉCNICO LABORAL' : 'CURSO / DIPLOMADO'}
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                          {course.code}
                        </span>
                        {course.duration && (
                          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{course.duration}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {course.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span>
                          Materias registradas: <strong className="text-slate-900">{courseSubs.length}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Total Créditos: <strong className="text-blue-900">{totalCredits} CR</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Carga semanal: <strong className="text-slate-900">{totalHours} horas</strong>
                        </span>
                      </div>
                    </div>

                    {/* DIRECT ACTION: ADD SUBJECT TO THIS EXACT COURSE */}
                    <button
                      type="button"
                      id={`btn-add-subject-to-${course.id}`}
                      onClick={() => handleOpenAddForCourse(course)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-900 to-sky-500 hover:from-blue-800 hover:to-sky-400 text-white text-xs font-bold shadow-xs cursor-pointer transition-all shrink-0"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Agregar Materia a este {isTecnico ? 'Técnico' : 'Curso'}</span>
                    </button>
                  </div>

                  {/* Course Subjects Table / List */}
                  <div className="p-0">
                    {courseSubs.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50/50">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-700">
                          Este {isTecnico ? 'técnico' : 'curso'} aún no tiene materias asignadas
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
                          Comienza a estructurar el pénsum académico agregando la primera asignatura.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenAddForCourse(course)}
                          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 text-xs font-bold cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Agregar Primera Materia</span>
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-500 bg-slate-50/40 text-[11px]">
                              <th className="py-2.5 px-4 font-semibold">Código</th>
                              <th className="py-2.5 px-4 font-semibold">Asignatura</th>
                              <th className="py-2.5 px-4 font-semibold">Docente Responsable</th>
                              <th className="py-2.5 px-4 font-semibold text-center">Créditos</th>
                              <th className="py-2.5 px-4 font-semibold text-center">Horas/Sem</th>
                              <th className="py-2.5 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {courseSubs.map((sub) => (
                              <tr
                                key={sub.id}
                                id={`subject-row-${sub.id}`}
                                className="hover:bg-slate-50/70 transition-colors"
                              >
                                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                                  {sub.code}
                                </td>
                                <td className="py-3 px-4 font-semibold text-slate-900">
                                  {sub.name}
                                </td>
                                <td className="py-3 px-4 text-slate-700">
                                  <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span className="font-medium">
                                      {sub.professor || 'Docente por asignar'}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center font-medium">
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">
                                    {sub.credits} CR
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center text-slate-600">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{sub.weeklyHours || 4}h</span>
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(sub)}
                                      className="p-1.5 text-slate-500 hover:text-blue-700 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                                      title="Editar materia"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      id={`btn-delete-subject-${sub.id}`}
                                      onClick={() => onDeleteSubject(sub.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                                      title="Eliminar materia"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Orphan Subjects if any */}
          {orphanSubjects.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-sm text-amber-950">
                  Materias Generales o Sin Curso Vinculado ({orphanSubjects.length})
                </h4>
              </div>
              <p className="text-xs text-amber-800">
                Estas materias no tienen un curso o técnico asociado directamente. Puedes editarlas para vincularlas a un programa.
              </p>
              <div className="overflow-x-auto bg-white rounded-xl border border-amber-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 bg-slate-50">
                      <th className="py-2.5 px-3 font-semibold">Código</th>
                      <th className="py-2.5 px-3 font-semibold">Materia</th>
                      <th className="py-2.5 px-3 font-semibold">Docente</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orphanSubjects.map((sub) => (
                      <tr key={sub.id}>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{sub.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{sub.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{sub.professor}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(sub)}
                            className="p-1 text-slate-500 hover:text-blue-700"
                            title="Asignar a un curso"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: FLAT TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm">Todas las Materias</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {filteredFlatSubjects.length}
              </span>
            </div>
          </div>

          {filteredFlatSubjects.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No hay materias que coincidan con los criterios seleccionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table id="subjects-table" className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                    <th className="py-2.5 px-3 font-semibold">Código</th>
                    <th className="py-2.5 px-3 font-semibold">Materia</th>
                    <th className="py-2.5 px-3 font-semibold">Curso o Técnico Asociado</th>
                    <th className="py-2.5 px-3 font-semibold">Docente Asignado</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Créditos</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Horas/Sem</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFlatSubjects.map((subject) => {
                    const parentCourse = courses.find((c) => c.id === subject.courseId);
                    const isTecnico =
                      parentCourse?.programType === 'Técnico' ||
                      parentCourse?.name.toLowerCase().includes('técnico');

                    return (
                      <tr key={subject.id} id={`subject-row-${subject.id}`} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-slate-800">
                          {subject.code}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {subject.name}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isTecnico
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {subject.courseName || parentCourse?.name || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-medium">{subject.professor}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-medium">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                            {subject.credits} CR
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {subject.weeklyHours}h
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(subject)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Editar materia"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-delete-subject-${subject.id}`}
                              type="button"
                              onClick={() => onDeleteSubject(subject.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar materia"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* QUICK ADD MODAL FOR A SPECIFIC COURSE */}
      {quickTargetCourse && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Agregar Materia al Pénsum
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Se asociará directamente al programa seleccionado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickTargetCourse(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Program Banner */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Programa Destino
                </span>
                <span className="font-bold text-xs text-slate-900 block truncate">
                  {quickTargetCourse.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {quickTargetCourse.programType || 'Programa'} • {quickTargetCourse.duration || 'Pénsum activo'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-900 text-white shrink-0">
                {quickTargetCourse.code}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveQuickSubject(false);
              }}
              className="space-y-3.5"
            >
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
                    placeholder="Ej: TEC-SIS-M01"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono uppercase font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    placeholder="Ej: Base de Datos Relacionales y SQL"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Créditos Académicos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={quickSubCredits}
                    onChange={(e) => setQuickSubCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    value={quickSubHours}
                    onChange={(e) => setQuickSubHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Docente Asignado
                </label>
                <select
                  value={quickSubTeacherId}
                  onChange={(e) => setQuickSubTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="">Por Asignar (Sin docente)</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} (C.C. {t.cedula})
                    </option>
                  ))}
                  <option value="custom">Otro docente (escribir nombre)...</option>
                </select>
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
                    placeholder="Ej: Lic. Carlos Andrés Gómez"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSaveQuickSubject(true)}
                  disabled={!quickSubName.trim() || !quickSubCode.trim()}
                  className="px-3.5 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 disabled:opacity-50 text-xs font-bold cursor-pointer transition-colors"
                >
                  Guardar y Agregar Otra
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickTargetCourse(null)}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!quickSubName.trim() || !quickSubCode.trim()}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-900 to-sky-500 hover:from-blue-800 hover:to-sky-400 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Guardar Materia
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SUBJECT MODAL */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-lg w-full animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-700" />
                <span>Editar Asignatura</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre de Materia *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Código *</label>
                  <input
                    type="text"
                    required
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Créditos</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={editCredits}
                    onChange={(e) => setEditCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Curso o Técnico *</label>
                  <select
                    value={editCourseId || ''}
                    onChange={(e) => setEditCourseId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer font-medium"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Horas Semanales</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={editWeeklyHours}
                    onChange={(e) => setEditWeeklyHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Docente Asignado</label>
                <select
                  value={editTeacherId || ''}
                  onChange={(e) => setEditTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="">Por Asignar (Sin docente)</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} (C.C. {t.cedula})
                    </option>
                  ))}
                  <option value="custom">Personalizado (Escribir nombre)</option>
                </select>
              </div>

              {editTeacherId === 'custom' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del Docente</label>
                  <input
                    type="text"
                    value={editCustomProf}
                    onChange={(e) => setEditCustomProf(e.target.value)}
                    placeholder="Ej: Lic. Hernán Cortés"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
