import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Award,
  LogOut,
  Clock,
  CheckCircle2,
  Search,
  School,
  Layers,
  FileEdit,
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  FolderKanban
} from 'lucide-react';
import { Activity, Subject, Course, StudentAdmission } from '../types';
import { INITIAL_SUBJECTS, INITIAL_STUDENTS, INITIAL_COURSES } from '../data/initialAcademicData';
import { TeacherActivitiesManager } from './TeacherActivitiesManager';

interface TeacherPortalProps {
  username: string;
  courses?: Course[];
  subjects?: Subject[];
  students?: StudentAdmission[];
  onUpdateSubject?: (subject: Subject) => void;
  activities: Activity[];
  onAddActivity: (act: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (act: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onLogout: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  username,
  courses = INITIAL_COURSES,
  subjects = INITIAL_SUBJECTS,
  students = INITIAL_STUDENTS,
  onUpdateSubject,
  activities,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'activities' | 'students' | 'grading'>('classes');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');

  // Professor subjects (for simplicity right now showing all subjects, in reality filter by professor name or id)
  const mySubjects = subjects;
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null;
  const courseSubjects = selectedCourse
    ? mySubjects.filter(
        (s) =>
          (s.courseId === selectedCourse.id ||
            (s.courseName && selectedCourse.name && s.courseName.toLowerCase() === selectedCourse.name.toLowerCase())) &&
          (subjectSearchTerm === '' || s.name.toLowerCase().includes(subjectSearchTerm.toLowerCase()) || s.code.toLowerCase().includes(subjectSearchTerm.toLowerCase()))
      )
    : mySubjects;

  const activeSubject = selectedSubjectId
    ? mySubjects.find((s) => s.id === selectedSubjectId) || null
    : null;

  const filteredStudents = students.filter(
    (st) =>
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.cedula.includes(searchTerm)
  );

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) || c.code.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  // For grading: filter students by the course of the currently selected subject in grading
  const gradingSubject = mySubjects.find(s => s.id === selectedSubjectId) || mySubjects[0];
  const gradingCourse = gradingSubject 
    ? courses.find(c => c.id === gradingSubject.courseId || (gradingSubject.courseName && c.name.toLowerCase() === gradingSubject.courseName.toLowerCase()))
    : null;
    
  const gradingStudents = students.filter(st => {
    if (!gradingCourse) return true;
    return st.courseId === gradingCourse.id || (st.courseName && st.courseName.toLowerCase() === gradingCourse.name.toLowerCase());
  });


  return (
    <div id="teacher-portal-container" className="min-h-screen w-full bg-slate-100 flex flex-col text-slate-800">
      {/* Top Navigation */}
      <header
        id="teacher-topbar"
        className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-700 to-teal-500 text-white flex items-center justify-center font-bold shadow-xs">
            <School className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-base leading-none">
                Portal Docente
              </span>
              <span
                id="teacher-role-tag"
                className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded bg-blue-100 text-blue-800 border border-blue-300"
              >
                PROFESOR
              </span>
            </div>
            <span className="text-xs text-slate-500">Periodo Académico 2026-I</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Docente activo
            </span>
            <span className="text-sm font-semibold text-slate-800 font-mono">
              {username.toUpperCase()}
            </span>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <button
            id="teacher-logout-button"
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main id="teacher-main-content" className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Tab Navigation */}
        <div id="teacher-tabs" className="flex border-b border-slate-200 gap-2 overflow-x-auto">
          <button
            id="tab-classes"
            type="button"
            onClick={() => setActiveTab('classes')}
            className={`pb-3 px-4 text-sm font-medium transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'classes'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Cursos y Asignaturas ({courses.length})</span>
          </button>

          

          <button
            id="tab-students"
            type="button"
            onClick={() => setActiveTab('students')}
            className={`pb-3 px-4 text-sm font-medium transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'students'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Lista de Estudiantes</span>
          </button>

          <button
            id="tab-grading"
            type="button"
            onClick={() => setActiveTab('grading')}
            className={`pb-3 px-4 text-sm font-medium transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'grading'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Registro de Calificaciones</span>
          </button>
        </div>

        {/* Tab 1: Cursos -> Asignaturas -> Actividades */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            {/* LEVEL 3: Sus Actividades */}
            {activeSubject && selectedCourse ? (
              <div className="space-y-4">
                {/* Navigation Breadcrumb */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(null);
                      setSelectedCourseId(null);
                    }}
                    className="font-medium text-blue-700 hover:underline cursor-pointer"
                  >
                    Panel de Cursos
                  </button>
                  <span>/</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectId(null)}
                    className="font-medium text-blue-700 hover:underline cursor-pointer"
                  >
                    {selectedCourse.name}
                  </button>
                  <span>/</span>
                  <span className="font-semibold text-slate-900">{activeSubject.name}</span>
                  <span>/</span>
                  <span className="text-slate-400">Gestión de Actividades</span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectId(null)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-blue-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver a Materias de {selectedCourse.name}</span>
                  </button>

                  <span className="text-xs text-slate-500 font-medium">
                    Materia: <strong className="text-slate-800">{activeSubject.name}</strong>
                  </span>
                </div>

                <TeacherActivitiesManager
                  subjects={mySubjects}
                  activities={activities}
                  selectedSubjectId={activeSubject.id}
                  onSelectSubjectId={setSelectedSubjectId}
                  onAddActivity={onAddActivity}
                  onUpdateActivity={onUpdateActivity}
                  onDeleteActivity={onDeleteActivity}
                  onUpdateSubject={onUpdateSubject}
            onBack={() => setActiveTab('classes')}
                />
              </div>
            ) : selectedCourse ? (
              /* LEVEL 2: Asignaturas o Materias del Curso */
              <div id="teacher-course-subjects-view" className="space-y-4">
                {/* Breadcrumb & Back */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCourseId(null)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950 bg-white hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-all w-fit cursor-pointer border border-slate-200 shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al Panel de Cursos</span>
                  </button>

                  <div className="text-xs text-slate-500 font-medium">
                    Curso seleccionado: <strong className="text-slate-900">{selectedCourse.name}</strong>
                  </div>
                </div>

                {/* Course Banner */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        {selectedCourse.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Carga Docente</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {selectedCourse.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Asignaturas asignadas en este curso. Haz clic en una materia para gestionar sus actividades evaluativas.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 self-start md:self-auto">
                    <div className="text-center px-3 border-r border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">Materias</div>
                      <div className="text-lg font-bold text-slate-900">{courseSubjects.length}</div>
                    </div>
                    <div className="text-center px-3">
                      <div className="text-xs text-slate-500 font-medium">Actividades</div>
                      <div className="text-lg font-bold text-blue-800">
                        {activities.filter((a) => courseSubjects.some((s) => s.id === a.subjectId)).length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects Grid */}
                {courseSubjects.length === 0 && subjectSearchTerm === '' ? (
                  <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">No hay materias asignadas en este curso.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Materias del Curso ({courseSubjects.length})
                      </p>
                      
                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Buscar materia o código..."
                          value={subjectSearchTerm}
                          onChange={(e) => setSubjectSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    {courseSubjects.length === 0 && subjectSearchTerm !== '' ? (
                      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
                        <p className="text-sm font-medium text-slate-700">No se encontraron materias que coincidan con "{subjectSearchTerm}".</p>
                      </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courseSubjects.map((sub) => {
                        const count = activities.filter((a) => a.subjectId === sub.id).length;

                        return (
                          <div
                            key={sub.id}
                            className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                  {sub.code}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {sub.credits} Créditos Académicos
                                </span>
                              </div>
                              <h3 className="font-semibold text-slate-900 text-base mb-1">{sub.name}</h3>
                              <p className="text-xs text-slate-500 mt-1">Docente: {sub.professor}</p>

                              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs border border-slate-100">
                                <Layers className="w-3.5 h-3.5 text-blue-700" />
                                <span>{count} actividades programadas</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                              <span className="flex items-center gap-1 text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                {sub.weeklyHours}h / semana
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setSelectedSubjectId(sub.id); setActiveTab('activities'); }}
                                  className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100"
                                >
                                  <FileEdit className="w-3.5 h-3.5" />
                                  <span>Gestionar Actividades →</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* LEVEL 1: Panel de Cursos */
              <div id="teacher-courses-panel" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-700" />
                      <span>Panel de Cursos Asignados</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Paso 1: Selecciona un curso para ver sus asignaturas o materias y luego configurar sus actividades.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar curso o código..."
                        value={courseSearchTerm}
                        onChange={(e) => setCourseSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 w-full text-center whitespace-nowrap">
                      {filteredCourses.length} Cursos Registrados
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map((course) => {
                    const cSubjects = mySubjects.filter(
                      (s) =>
                        s.courseId === course.id ||
                        (s.courseName && course.name && s.courseName.toLowerCase() === course.name.toLowerCase())
                    );
                    const cActivities = activities.filter((a) =>
                      cSubjects.some((s) => s.id === a.subjectId)
                    );

                    return (
                      <div
                        key={course.id}
                        id={`teacher-course-card-${course.id}`}
                        onClick={() => setSelectedCourseId(course.id)}
                        className="bg-white border border-slate-200 hover:border-blue-600 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group text-left"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                              {course.code}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              Docencia ULEP
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors leading-snug">
                            {course.name}
                          </h3>

                          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                                <span>Materias asignadas:</span>
                              </span>
                              <strong className="font-bold text-slate-800">{cSubjects.length}</strong>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-teal-700" />
                                <span>Actividades programadas:</span>
                              </span>
                              <span className="font-semibold text-slate-700">{cActivities.length}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-5 mt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-700 group-hover:text-blue-800 flex items-center gap-1">
                            <span>Gestionar Materias</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>

                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            Nivel 1 de 3
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Activities Manager */}
        {activeTab === 'activities' && (
          <TeacherActivitiesManager
            subjects={mySubjects}
            activities={activities}
            selectedSubjectId={selectedSubjectId || mySubjects[0]?.id || ''}
            onSelectSubjectId={setSelectedSubjectId}
            onAddActivity={onAddActivity}
            onUpdateActivity={onUpdateActivity}
            onDeleteActivity={onDeleteActivity}
            onUpdateSubject={onUpdateSubject}
            onBack={() => setActiveTab('classes')}
          />
        )}

        {/* Tab 3: Students */}
        {activeTab === 'students' && (
          <div id="teacher-students-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Directorio de Estudiantes Matriculados</h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar estudiante o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs relative">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-100">
                    <th className="py-2.5 px-3 font-semibold">Cédula</th>
                    <th className="py-2.5 px-3 font-semibold">Estudiante</th>
                    <th className="py-2.5 px-3 font-semibold">Correo</th>
                    <th className="py-2.5 px-3 font-semibold">Programa / Curso</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">{st.cedula}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{st.fullName}</td>
                      <td className="py-3 px-3 text-slate-600">{st.email}</td>
                      <td className="py-3 px-3 text-slate-600">{st.courseName}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                          Matriculado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Grading */}
        {activeTab === 'grading' && (
          <div id="teacher-grading-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Planilla de Calificaciones</h2>
                <p className="text-xs text-slate-500">Materia: {activeSubject?.name || 'Seleccione una materia'}</p>
              </div>

              <select
                aria-label="Seleccionar Asignatura para planilla de calificaciones"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {mySubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs relative">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-100">
                    <th className="py-2.5 px-3 font-semibold">Cédula</th>
                    <th className="py-2.5 px-3 font-semibold">Estudiante</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Corte 1 (30%)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Corte 2 (30%)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Corte 3 (40%)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Definitiva</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {gradingStudents.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">{st.cedula}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{st.fullName}</td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          step="0.1"
                          defaultValue={idx === 0 ? '4.5' : idx === 1 ? '4.8' : '4.0'}
                          className="w-14 text-center p-1 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-600"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          step="0.1"
                          defaultValue={idx === 0 ? '4.2' : idx === 1 ? '5.0' : '3.8'}
                          className="w-14 text-center p-1 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-600"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          step="0.1"
                          defaultValue={idx === 0 ? '4.8' : idx === 1 ? '4.7' : '4.2'}
                          className="w-14 text-center p-1 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-600"
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-blue-800">
                        {idx === 0 ? '4.5' : idx === 1 ? '4.8' : '4.0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

