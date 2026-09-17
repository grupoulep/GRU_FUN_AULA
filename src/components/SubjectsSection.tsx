import React, { useState } from 'react';
import { Subject, Course } from '../types';
import { Edit2, Save, X } from 'lucide-react';
import { Plus, BookOpen, Search, Trash2, Clock, User, Award } from 'lucide-react';

interface SubjectsSectionProps {
  subjects: Subject[];
  courses: Course[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onDeleteSubject: (id: string) => void;
  onUpdateSubject?: (subject: Subject) => void;
}

export const SubjectsSection: React.FC<SubjectsSectionProps> = ({
  subjects,
  courses,
  onAddSubject,
  onDeleteSubject,
  onUpdateSubject
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('todos');

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(4);
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [professor, setProfessor] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editCredits, setEditCredits] = useState(4);
  const [editCourseId, setEditCourseId] = useState('');
  const [editProfessor, setEditProfessor] = useState('');
  const [editWeeklyHours, setEditWeeklyHours] = useState(4);

  const handleStartEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setEditName(subject.name);
    setEditCode(subject.code);
    setEditCredits(subject.credits);
    setEditCourseId(subject.courseId || '');
    setEditProfessor(subject.professor || '');
    setEditWeeklyHours(subject.weeklyHours);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim() && editCode.trim() && onUpdateSubject) {
      const matchedCourse = courses.find((c) => c.id === editCourseId);
      const courseName = matchedCourse ? matchedCourse.name : 'General';
      onUpdateSubject({
        id: editingId,
        name: editName.trim(),
        code: editCode.trim().toUpperCase(),
        credits: editCredits,
        courseId: editCourseId,
        courseName,
        professor: editProfessor,
        weeklyHours: editWeeklyHours
      });
      setEditingId(null);
      setSuccessMessage('¡Materia actualizada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const matchedCourse = courses.find((c) => c.id === courseId);
    const courseName = matchedCourse ? matchedCourse.name : 'General';

    onAddSubject({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      credits: Number(credits) || 3,
      courseId: courseId || (courses[0]?.id ?? 'default'),
      courseName,
      professor: professor.trim() || 'Docente por asignar',
      weeklyHours: Number(weeklyHours) || 4
    });

    setName('');
    setCode('');
    setProfessor('');
    setCredits(4);
    setWeeklyHours(4);
    setShowForm(false);
    setSuccessMessage('¡Materia registrada exitosamente!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourseFilter === 'todos' || s.courseId === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div id="subjects-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 id="subjects-title" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-slate-900" />
            <span>Agregar y Configurar Materias</span>
          </h2>
          <p id="subjects-subtitle" className="text-sm text-slate-500 mt-0.5">
            Administra las asignaturas curriculares, carga crediticia y asignación de profesores.
          </p>
        </div>

        <button
          id="btn-toggle-new-subject"
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cerrar Formulario' : 'Nueva Materia'}</span>
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div
          id="subject-success-alert"
          role="status"
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium"
        >
          {successMessage}
        </div>
      )}

      {/* New Subject Form */}
      {showForm && (
        <section
          id="new-subject-form-card"
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs"
        >
          <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Formulario de Registro de Asignatura
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="subject-name-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre de la Asignatura / Materia *
                </label>
                <input
                  id="subject-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Cálculo Integral, Redes de Datos..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label htmlFor="subject-code-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Código de la Materia *
                </label>
                <input
                  id="subject-code-input"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ej: MAT-202"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase"
                />
              </div>

              <div>
                <label htmlFor="subject-course-select" className="block text-xs font-medium text-slate-700 mb-1">
                  Curso / Programa Perteneciente
                </label>
                <select
                  id="subject-course-select"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject-credits-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Créditos Académicos
                </label>
                <input
                  id="subject-credits-input"
                  type="number"
                  min="1"
                  max="12"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label htmlFor="subject-hours-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Horas Semanales
                </label>
                <input
                  id="subject-hours-input"
                  type="number"
                  min="1"
                  max="30"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label htmlFor="subject-prof-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Docente Responsable
                </label>
                <input
                  id="subject-prof-input"
                  type="text"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="Ej: Lic. Carlos Andrés Gómez"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-submit-subject"
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-teal-500 text-white text-xs font-medium hover:from-blue-800 hover:to-teal-600 cursor-pointer"
              >
                Guardar Materia
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Subjects Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">Materias Registradas</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {subjects.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              id="filter-subject-course"
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="todos">Todos los cursos</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="search-subjects-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar materia o docente..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {filteredSubjects.length === 0 ? (
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
                  <th className="py-2.5 px-3 font-semibold">Curso Asociado</th>
                  <th className="py-2.5 px-3 font-semibold">Docente</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Créditos</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Horas/Sem</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} id={`subject-row-${subject.id}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      {subject.code}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {subject.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="inline-block max-w-[200px] truncate" title={subject.courseName}>
                        {subject.courseName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{subject.professor}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
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
                      <button
                        id={`btn-delete-subject-${subject.id}`}
                        type="button"
                        onClick={() => onDeleteSubject(subject.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar materia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
};
