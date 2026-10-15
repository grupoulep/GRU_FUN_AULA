import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Award,
  LogOut,
  Clock,
  CheckCircle2,
  Search,
  Layers,
  FileEdit,
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  FolderKanban,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';
import { Activity, Subject, Course, StudentAdmission, Teacher, StudentGrade } from '../types';
import { INITIAL_SUBJECTS, INITIAL_STUDENTS, INITIAL_COURSES } from '../data/initialAcademicData';
import { GlobalStudentSearch } from "./GlobalStudentSearch";
import { TeacherActivitiesManager } from './TeacherActivitiesManager';

interface TeacherPortalProps {
  username: string;
  teachers?: Teacher[];
  courses?: Course[];
  subjects?: Subject[];
  students?: StudentAdmission[];
  grades?: StudentGrade[];
  onSaveGrade?: (grade: StudentGrade) => void;
  onSaveBulkGrades?: (grades: StudentGrade[]) => void;
  onUpdateSubject?: (subject: Subject) => void;
  activities: Activity[];
  onAddActivity: (act: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (act: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onLogout: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  username,
  teachers = [],
  courses = INITIAL_COURSES,
  subjects = INITIAL_SUBJECTS,
  students = INITIAL_STUDENTS,
  grades = [],
  onSaveBulkGrades,
  onUpdateSubject,
  activities,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'activities' | 'students' | 'grading'>('classes');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Local state for grading inputs: studentId -> { corte1, corte2, corte3 }
  const [gradeInputs, setGradeInputs] = useState<Record<string, { corte1: string; corte2: string; corte3: string }>>({});

  // Locate current teacher
  const currentTeacher = teachers.find(
    (t) =>
      t.cedula.trim().toUpperCase() === username.trim().toUpperCase() ||
      t.id === username
  );

  // Filter subjects assigned to this teacher or belonging to teacher's assigned courses
  const teacherCourseIds = currentTeacher?.courseIds || [];
  
  const myAssignedSubjects = subjects.filter((s) => {
    if (!currentTeacher) return true;
    const isDirectProf =
      (s.professorCedula && s.professorCedula.trim() === currentTeacher.cedula.trim()) ||
      (s.professorId && s.professorId === currentTeacher.id) ||
      (s.professor && currentTeacher.fullName && s.professor.toLowerCase().includes(currentTeacher.fullName.toLowerCase())) ||
      (currentTeacher.fullName && s.professor && currentTeacher.fullName.toLowerCase().includes(s.professor.toLowerCase()));
    const isCourseAssigned = teacherCourseIds.includes(s.courseId);
    return isDirectProf || isCourseAssigned;
  });

  // If teacher has assigned subjects, show those; otherwise fallback gracefully to all subjects
  const mySubjects = myAssignedSubjects.length > 0 ? myAssignedSubjects : subjects;

  // Initialize selectedSubjectId once subjects are available
  useEffect(() => {
    if (!selectedSubjectId && mySubjects.length > 0) {
      setSelectedSubjectId(mySubjects[0].id);
    }
  }, [mySubjects, selectedSubjectId]);

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
    ? mySubjects.find((s) => s.id === selectedSubjectId) || mySubjects[0]
    : mySubjects[0];

  const filteredStudents = students.filter(
    (st) =>
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.cedula.includes(searchTerm)
  );

  const filteredCourses = courses.filter((c) =>
    (teacherCourseIds.length === 0 || teacherCourseIds.includes(c.id)) &&
    (c.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) || c.code.toLowerCase().includes(courseSearchTerm.toLowerCase()))
  );

  // Grading Course & Students
  const gradingSubject = mySubjects.find((s) => s.id === selectedSubjectId) || mySubjects[0];
  const gradingCourse = gradingSubject 
    ? courses.find((c) => c.id === gradingSubject.courseId || (gradingSubject.courseName && c.name.toLowerCase() === gradingSubject.courseName.toLowerCase()))
    : null;
    
  const gradingStudents = students.filter((st) => {
    if (!gradingCourse) return true;
    return (
      st.courseId === gradingCourse.id ||
      (st.courseIds && st.courseIds.includes(gradingCourse.id)) ||
      (st.courseName && st.courseName.toLowerCase() === gradingCourse.name.toLowerCase()) ||
      (st.courseName && st.courseName.toLowerCase().includes(gradingCourse.name.toLowerCase()))
    );
  });

  // Populate gradeInputs whenever gradingSubject or grades changes
  useEffect(() => {
    if (!gradingSubject) return;
    const initialInputs: Record<string, { corte1: string; corte2: string; corte3: string }> = {};
    gradingStudents.forEach((st) => {
      const existing = grades.find(
        (g) =>
          g.subjectId === gradingSubject.id &&
          (g.studentId === st.id || g.studentCedula === st.cedula)
      );
      initialInputs[st.id] = {
        corte1: existing?.corte1 !== undefined ? String(existing.corte1) : '',
        corte2: existing?.corte2 !== undefined ? String(existing.corte2) : '',
        corte3: existing?.corte3 !== undefined ? String(existing.corte3) : ''
      };
    });
    setGradeInputs(initialInputs);
  }, [gradingSubject?.id, grades, gradingStudents.length]);

  const handleGradeChange = (studentId: string, corte: 'corte1' | 'corte2' | 'corte3', val: string) => {
    setGradeInputs((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [corte]: val
      }
    }));
  };

  const calculateDefinitiva = (c1: string, c2: string, c3: string): number | null => {
    const n1 = parseFloat(c1);
    const n2 = parseFloat(c2);
    const n3 = parseFloat(c3);
    if (isNaN(n1) && isNaN(n2) && isNaN(n3)) return null;

    const val1 = isNaN(n1) ? 0 : n1;
    const val2 = isNaN(n2) ? 0 : n2;
    const val3 = isNaN(n3) ? 0 : n3;

    const def = (val1 * 0.3) + (val2 * 0.3) + (val3 * 0.4);
    return parseFloat(def.toFixed(1));
  };

  const handleSaveAllGrades = () => {
    if (!gradingSubject || !onSaveBulkGrades) return;

    const gradesToSave: StudentGrade[] = gradingStudents.map((st) => {
      const inputs = gradeInputs[st.id] || { corte1: '', corte2: '', corte3: '' };
      const n1 = inputs.corte1 !== '' ? parseFloat(inputs.corte1) : undefined;
      const n2 = inputs.corte2 !== '' ? parseFloat(inputs.corte2) : undefined;
      const n3 = inputs.corte3 !== '' ? parseFloat(inputs.corte3) : undefined;
      const def = calculateDefinitiva(inputs.corte1, inputs.corte2, inputs.corte3) ?? undefined;

      return {
        id: `${st.id}_${gradingSubject.id}`,
        studentId: st.id,
        studentCedula: st.cedula,
        studentName: st.fullName,
        subjectId: gradingSubject.id,
        subjectName: gradingSubject.name,
        courseId: gradingSubject.courseId,
        corte1: n1,
        corte2: n2,
        corte3: n3,
        definitiva: def,
        updatedAt: new Date().toISOString()
      };
    });

    onSaveBulkGrades(gradesToSave);
    setSaveSuccessMsg('¡Planilla de calificaciones guardada y sincronizada exitosamente con el portal del estudiante!');
    setTimeout(() => setSaveSuccessMsg(''), 4500);
  };

  return (
    <div id="teacher-portal-container" className="min-h-screen w-full bg-slate-100 flex flex-col text-blue-900">
      {/* Top Navigation */}
      <header
        id="teacher-topbar"
        className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <img src="/logofun01.png" alt="Fundación ULEP" className="h-9 w-auto object-contain" />
          <span className="hidden md:inline-block text-xs font-bold text-blue-950 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
            Portal Docente
          </span>
        </div>

        <div className="flex items-center gap-3">
          <GlobalStudentSearch students={students} />
          <div className="h-7 w-px bg-slate-200 hidden sm:block" />
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800">
              {currentTeacher?.fullName || 'Docente Activo'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              C.C. {currentTeacher?.cedula || username}
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
        
        {/* Welcome & Teacher Summary Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-sky-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-sky-200 font-semibold">
              Panel Académico y Evaluativo
            </span>
            <h1 className="text-2xl font-black text-white">
              {currentTeacher?.fullName ? `Bienvenido, ${currentTeacher.fullName}` : 'Panel del Docente'}
            </h1>
            <p className="text-xs text-slate-200 max-w-xl">
              Gestiona tus asignaturas, crea actividades interactivas, califica a tus estudiantes y mantén la información académica sincronizada en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-center">
              <span className="block text-xl font-bold text-white">{mySubjects.length}</span>
              <span className="text-[10px] text-sky-200 uppercase tracking-wide">Materias</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-center">
              <span className="block text-xl font-bold text-white">{students.length}</span>
              <span className="text-[10px] text-sky-200 uppercase tracking-wide">Alumnos</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-center">
              <span className="block text-xl font-bold text-white">{activities.length}</span>
              <span className="text-[10px] text-sky-200 uppercase tracking-wide">Actividades</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div id="teacher-tabs" className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          <button
            id="tab-classes"
            type="button"
            onClick={() => {
              setActiveTab('classes');
              setSelectedCourseId(null);
            }}
            className={`py-2 px-4 text-sm font-semibold transition-all cursor-pointer rounded-xl flex items-center gap-2 ${
              activeTab === 'classes'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-blue-900 hover:bg-slate-200/50'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Mis Cursos y Materias ({mySubjects.length})</span>
          </button>

          <button
            id="tab-activities"
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`py-2 px-4 text-sm font-semibold transition-all cursor-pointer rounded-xl flex items-center gap-2 ${
              activeTab === 'activities'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-blue-900 hover:bg-slate-200/50'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Gestor de Actividades</span>
          </button>

          <button
            id="tab-grading"
            type="button"
            onClick={() => setActiveTab('grading')}
            className={`py-2 px-4 text-sm font-semibold transition-all cursor-pointer rounded-xl flex items-center gap-2 ${
              activeTab === 'grading'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-blue-900 hover:bg-slate-200/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Planilla de Calificaciones</span>
          </button>

          <button
            id="tab-students"
            type="button"
            onClick={() => setActiveTab('students')}
            className={`py-2 px-4 text-sm font-semibold transition-all cursor-pointer rounded-xl flex items-center gap-2 ${
              activeTab === 'students'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-blue-900 hover:bg-slate-200/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Estudiantes Matriculados ({students.length})</span>
          </button>
        </div>

        {/* Tab 1: Classes & Courses */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            {selectedCourse ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCourseId(null)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-blue-900 hover:text-blue-700 bg-white hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-all w-fit cursor-pointer border border-slate-200 shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver a Cursos Asignados</span>
                  </button>

                  <div className="text-xs text-slate-500">
                    Programa: <strong className="text-blue-950 font-bold">{selectedCourse.name}</strong>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
                      Materias del Programa ({courseSubjects.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseSubjects.map((sub) => {
                      const subActivities = activities.filter((a) => a.subjectId === sub.id);
                      return (
                        <div
                          key={sub.id}
                          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {sub.code}
                              </span>
                              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                {sub.credits} Créditos
                              </span>
                            </div>
                            <h3 className="font-bold text-blue-950 text-base">{sub.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{sub.weeklyHours} horas semanales</span>
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-600 font-medium">
                              {subActivities.length} actividades programadas
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSubjectId(sub.id);
                                  setActiveTab('activities');
                                }}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                Actividades
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSubjectId(sub.id);
                                  setActiveTab('grading');
                                }}
                                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                Calificar
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base font-bold text-blue-950">
                    Programas y Cursos Asignados ({filteredCourses.length})
                  </h2>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map((course) => {
                    const cSubjects = mySubjects.filter(
                      (s) => s.courseId === course.id || (s.courseName && s.courseName.toLowerCase() === course.name.toLowerCase())
                    );
                    const cStudents = students.filter(
                      (st) => st.courseId === course.id || (st.courseIds && st.courseIds.includes(course.id))
                    );

                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-100">
                              {course.code}
                            </span>
                            <GraduationCap className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
                          </div>
                          <h3 className="font-bold text-blue-950 text-base group-hover:text-blue-700 transition-colors">
                            {course.name}
                          </h3>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span>{cSubjects.length} materias</span>
                          <span>{cStudents.length} matriculados</span>
                          <span className="text-blue-700 font-bold group-hover:translate-x-0.5 transition-transform">
                            Ver materias →
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

        {/* Tab 3: Grading Planilla */}
        {activeTab === 'grading' && (
          <div id="teacher-grading-card" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-700" />
                  <span>Planilla Oficial de Calificaciones</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ingresa las calificaciones de Corte 1 (30%), Corte 2 (30%) y Corte 3 (40%). La nota definitiva se calculará y sincronizará en tiempo real.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="select-grading-subject" className="text-xs font-semibold text-slate-700">
                    Asignatura:
                  </label>
                  <select
                    id="select-grading-subject"
                    aria-label="Seleccionar Asignatura para planilla de calificaciones"
                    value={selectedSubjectId || mySubjects[0]?.id || ''}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium cursor-pointer"
                  >
                    {mySubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAllGrades}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-900 to-sky-600 text-white text-xs font-bold hover:from-blue-800 hover:to-sky-500 flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Planilla</span>
                </button>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{saveSuccessMsg}</span>
              </div>
            )}

            {gradingStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No hay estudiantes matriculados en este curso todavía.</p>
                <p className="text-slate-400 mt-1">Registra o matricula alumnos desde el panel de admisiones.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs relative">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/80">
                      <th className="py-3 px-3 font-semibold">Cédula</th>
                      <th className="py-3 px-3 font-semibold">Estudiante</th>
                      <th className="py-3 px-3 font-semibold text-center">Corte 1 (30%)</th>
                      <th className="py-3 px-3 font-semibold text-center">Corte 2 (30%)</th>
                      <th className="py-3 px-3 font-semibold text-center">Corte 3 (40%)</th>
                      <th className="py-3 px-3 font-semibold text-center">Nota Definitiva</th>
                      <th className="py-3 px-3 font-semibold text-center">Estado Académico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {gradingStudents.map((st) => {
                      const inputs = gradeInputs[st.id] || { corte1: '', corte2: '', corte3: '' };
                      const definitiva = calculateDefinitiva(inputs.corte1, inputs.corte2, inputs.corte3);
                      const isPassing = definitiva !== null ? definitiva >= 3.0 : null;

                      return (
                        <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-slate-700">{st.cedula}</td>
                          <td className="py-3 px-3 font-semibold text-blue-950">{st.fullName}</td>
                          
                          {/* Corte 1 */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={inputs.corte1}
                              onChange={(e) => handleGradeChange(st.id, 'corte1', e.target.value)}
                              placeholder="0.0"
                              className="w-16 text-center p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                            />
                          </td>

                          {/* Corte 2 */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={inputs.corte2}
                              onChange={(e) => handleGradeChange(st.id, 'corte2', e.target.value)}
                              placeholder="0.0"
                              className="w-16 text-center p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                            />
                          </td>

                          {/* Corte 3 */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={inputs.corte3}
                              onChange={(e) => handleGradeChange(st.id, 'corte3', e.target.value)}
                              placeholder="0.0"
                              className="w-16 text-center p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                            />
                          </td>

                          {/* Definitiva */}
                          <td className="py-3 px-3 text-center">
                            {definitiva !== null ? (
                              <span className={`inline-block font-bold text-sm px-2.5 py-0.5 rounded-lg ${
                                isPassing ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'
                              }`}>
                                {definitiva.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono">-</span>
                            )}
                          </td>

                          {/* Estado */}
                          <td className="py-3 px-3 text-center">
                            {definitiva !== null ? (
                              isPassing ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <Check className="w-3 h-3" />
                                  <span>Aprobado</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Reprobado</span>
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 text-xs">Sin evaluar</span>
                            )}
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

        {/* Tab 4: Students Directory */}
        {activeTab === 'students' && (
          <div id="teacher-students-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-blue-950">Directorio de Estudiantes Matriculados</h2>
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
                    <th className="py-2.5 px-3 font-semibold">Programa(s) Inscrito(s)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">{st.cedula}</td>
                      <td className="py-3 px-3 font-semibold text-blue-950">{st.fullName}</td>
                      <td className="py-3 px-3 text-slate-600">{st.email}</td>
                      <td className="py-3 px-3 text-slate-700 font-medium">{st.courseName}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px] border border-emerald-200">
                          {st.status || 'Matriculado'}
                        </span>
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
