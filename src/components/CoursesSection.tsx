import React, { useState } from 'react';
import { Course } from '../types';
import { Edit2, Save, X } from 'lucide-react';
import { Plus, GraduationCap, Search, Trash2, Hash } from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  onDeleteCourse: (id: string) => void;
  onUpdateCourse?: (course: Course) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  onAddCourse,
  onDeleteCourse,
  onUpdateCourse
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State: ONLY name and search code
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');

  const handleStartEdit = (course: Course) => {
    setEditingId(course.id);
    setEditName(course.name);
    setEditCode(course.code);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim() && editCode.trim() && onUpdateCourse) {
      onUpdateCourse({ id: editingId, name: editName.trim(), code: editCode.trim().toUpperCase() });
      setEditingId(null);
      setSuccessMessage('¡Curso actualizado exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    onAddCourse({
      name: name.trim(),
      code: code.trim().toUpperCase()
    });

    // Reset form
    setName('');
    setCode('');
    setShowForm(false);
    setSuccessMessage('¡Curso creado exitosamente!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="courses-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            id="courses-title"
            className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5"
          >
            <GraduationCap className="w-6 h-6 text-slate-900" />
            <span>Crear y Gestionar Cursos</span>
          </h2>
          <p id="courses-subtitle" className="text-sm text-slate-500 mt-0.5">
            Registro simplificado con código de búsqueda y nombre del curso.
          </p>
        </div>

        <button
          id="btn-toggle-new-course"
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cerrar Formulario' : 'Nuevo Curso'}</span>
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div
          id="course-success-alert"
          role="status"
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium"
        >
          {successMessage}
        </div>
      )}

      {/* New Course Form - Only Name and Search Code */}
      {showForm && (
        <section
          id="new-course-form-card"
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs transition-all"
        >
          <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Formulario de Registro de Curso
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="course-code-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Código de Búsqueda *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    id="course-code-input"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej: SIS-101"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Identificador único para buscar y vincular el curso
                </span>
              </div>

              <div>
                <label
                  htmlFor="course-name-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Nombre del Curso *
                </label>
                <input
                  id="course-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Ingeniería de Sistemas - Semestre I"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Nombre descriptivo del curso o carrera
                </span>
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
                id="btn-submit-course"
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-teal-500 text-white text-xs font-medium hover:from-blue-800 hover:to-teal-600 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Guardar Curso</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Courses List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">Cursos Registrados</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {courses.length}
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="search-courses-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código de búsqueda o nombre..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No se encontraron cursos con ese código de búsqueda o nombre.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-gradient-to-r from-blue-700 to-teal-500 text-white">
                      {course.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Código de búsqueda
                    </span>
                  </div>
                  <h4
                    className="font-semibold text-slate-900 text-sm truncate"
                    title={course.name}
                  >
                    {course.name}
                  </h4>
                </div>

                <button
                  id={`btn-delete-course-${course.id}`}
                  type="button"
                  onClick={() => onDeleteCourse(course.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Eliminar curso"
                  aria-label={`Eliminar curso ${course.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
