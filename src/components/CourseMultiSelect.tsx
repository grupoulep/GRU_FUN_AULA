import React, { useState } from 'react';
import { Course } from '../types';
import { Check, Search } from 'lucide-react';

interface CourseMultiSelectProps {
  id?: string;
  courses: Course[];
  selectedCourseIds: string[];
  onChange: (courseIds: string[]) => void;
  label?: string;
}

export const CourseMultiSelect: React.FC<CourseMultiSelectProps> = ({
  id = 'course-multi-select',
  courses,
  selectedCourseIds,
  onChange,
  label = 'Curso(s) / Programa(s) Académico(s)'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCourse = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      onChange(selectedCourseIds.filter((cId) => cId !== courseId));
    } else {
      onChange([...selectedCourseIds, courseId]);
    }
  };

  const selectAll = () => {
    onChange(courses.map((c) => c.id));
  };

  const deselectAll = () => {
    onChange([]);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id={id} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {selectedCourseIds.length === 0
              ? 'Ningún curso seleccionado'
              : selectedCourseIds.length === 1
              ? '1 curso seleccionado'
              : `${selectedCourseIds.length} cursos seleccionados`}
          </span>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
          Curso General (No hay cursos específicos creados aún en el sistema)
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden">
          {/* Controls toolbar */}
          <div className="p-2 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar curso por nombre o código..."
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={selectAll}
                className="px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
              >
                Seleccionar todos
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={deselectAll}
                className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 rounded transition-colors cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Courses list */}
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredCourses.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                No hay cursos que coincidan con "{searchTerm}"
              </div>
            ) : (
              filteredCourses.map((c) => {
                const isSelected = selectedCourseIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCourse(c.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 hover:bg-blue-100/70 text-blue-900'
                        : 'hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Código: {c.code}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-semibold bg-blue-200/80 text-blue-800 px-1.5 py-0.5 rounded shrink-0">
                        Asignado
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
