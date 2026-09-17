import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  LogOut,
  Clock,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Layers,
  ArrowLeft,
  FolderKanban
} from 'lucide-react';
import { Subject, Activity, Course, StudentAdmission, Banner, CentralAnnouncement } from '../types';
import { X as XIcon, Megaphone } from 'lucide-react';
import { INITIAL_SUBJECTS, INITIAL_COURSES, INITIAL_STUDENTS } from '../data/initialAcademicData';
import { SubjectActivitiesView } from './SubjectActivitiesView';

const StudentBannerCarousel: React.FC<{ banners: Banner[] }> = ({ banners }) => {
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= activeBanners.length) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  useEffect(() => {
    if (activeBanners.length < 2) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  return (
    <div className="w-full relative h-48 sm:h-64 md:h-72 rounded-2xl overflow-hidden shadow-xs group">
      {activeBanners.map((banner, idx) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
          {banner.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 sm:p-6 pt-12 text-white">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight shadow-sm">{banner.title}</h2>
            </div>
          )}
        </div>
      ))}
      
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer shadow-sm ${
                idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface StudentPortalProps {
  username: string;
  courses?: Course[];
  subjects?: Subject[];
  activities: Activity[];
  students?: StudentAdmission[];
  banners?: Banner[];
  mainAds?: Banner[];
  centralAnnouncement?: CentralAnnouncement;
  onSubmitActivity: (activityId: string, notes: string) => void;
  onUpdateActivity?: (act: Activity) => void;
  onLogout: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  username,
  courses = INITIAL_COURSES,
  subjects = INITIAL_SUBJECTS,
  activities,
  students = INITIAL_STUDENTS,
  banners = [],
  mainAds = [],
  centralAnnouncement,
  onSubmitActivity,
  onUpdateActivity,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'grades'>('subjects');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(centralAnnouncement?.active || false);
  const activeMainAds = mainAds.filter(ad => ad.active);
  const [showMainAds, setShowMainAds] = useState(activeMainAds.length > 0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Find the current student
  const currentStudent = students.find((s) => s.cedula === username);

  // Filter courses based on student's assigned course (if found, otherwise show all for fallback)
  const studentCourses = currentStudent
    ? courses.filter(
        (c) =>
          c.id === currentStudent.courseId ||
          (currentStudent.courseName && c.name.toLowerCase() === currentStudent.courseName.toLowerCase())
      )
    : courses;

  // Active course and its subjects
  const selectedCourse = studentCourses.find((c) => c.id === selectedCourseId) || null;
  const studentSubjects = studentCourses.flatMap(c => subjects.filter(s => s.courseId === c.id || (s.courseName && c.name && s.courseName.toLowerCase() === c.name.toLowerCase())));
  const courseSubjects = selectedCourse
    ? subjects.filter(
        (s) =>
          s.courseId === selectedCourse.id ||
          (s.courseName && selectedCourse.name && s.courseName.toLowerCase() === selectedCourse.name.toLowerCase())
      )
    : [];

  const selectedSubject = selectedSubjectId
    ? subjects.find((s) => s.id === selectedSubjectId) || null
    : null;

  

  

  return (
    <div id="student-portal-container" className="min-h-screen w-full bg-slate-100 flex flex-col text-blue-900">
      {/* Main Ads Modal */}
      {showMainAds && activeMainAds.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-[50px]">
          <div className="absolute inset-0 bg-transparent backdrop-blur-md"></div>
          
          <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            
            <button
              onClick={() => setShowMainAds(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors cursor-pointer"
              title="Cerrar"
            >
              <XIcon className="w-6 h-6" />
            </button>

            <img 
              src={activeMainAds[currentAdIndex].imageUrl} 
              alt={activeMainAds[currentAdIndex].title || 'Publicidad'} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <header
        id="student-topbar"
        className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <img src="/logofun01.png" alt="Fundación ULEP" className="h-9 w-auto object-contain" />
        </div>

        <div className="flex items-center gap-3">
          <button
            id="student-logout-button"
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
      <main id="student-main-content" className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <StudentBannerCarousel banners={banners} />
        
        {/* Tab Navigation */}
        <div id="student-tabs" className="flex bg-white p-1.5 rounded-2xl border border-slate-200 gap-1 overflow-x-auto shadow-xs w-fit">
          <button
            id="tab-subjects"
            type="button"
            onClick={() => {
              setActiveTab('subjects');
            }}
            className={`py-2 px-4 text-sm font-semibold transition-all cursor-pointer rounded-xl flex items-center gap-2 ${
              activeTab === 'subjects'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-transparent text-slate-500 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Cursos y Asignaturas ({studentCourses.length})</span>
          </button>

          <button
            id="tab-grades"
            type="button"
            onClick={() => {
              setActiveTab('grades');
              setSelectedSubjectId(null);
            }}
            className={`py-2 px-4 text-sm font-semibold transition-all cursor-pointer rounded-xl flex items-center gap-2 ${
              activeTab === 'grades'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-transparent text-slate-500 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Calificaciones y Notas</span>
          </button>

          
        </div>

        {/* Tab 1: Cursos -> Asignaturas -> Actividades Portal */}
        {activeTab === 'subjects' && (
          <div>
            {/* LEVEL 3: Sus Actividades */}
            {selectedSubject ? (
              <div className="space-y-4">
                {/* Navigation Breadcrumb */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(null);
                      setSelectedCourseId(null);
                    }}
                    className="font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    Panel de Cursos
                  </button>
                  <span>/</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectId(null)}
                    className="font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    {selectedCourse?.name || 'Curso'}
                  </button>
                  <span>/</span>
                  <span className="font-semibold text-blue-950">{selectedSubject.name}</span>
                  <span>/</span>
                  <span className="text-slate-400">Actividades Evaluativas</span>
                </div>

                <SubjectActivitiesView
                  subject={selectedSubject}
                  activities={activities}
                  onBack={() => setSelectedSubjectId(null)}
                  onSubmitActivity={onSubmitActivity}
                  onUpdateActivity={onUpdateActivity}
                />
              </div>
            ) : selectedCourse ? (
              /* LEVEL 2: Asignaturas o Materias del Curso Seleccionado */
              <div id="student-course-subjects-view" className="space-y-5">
                {/* Navigation Bar & Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    id="btn-back-to-courses"
                    type="button"
                    onClick={() => setSelectedCourseId(null)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-all w-fit cursor-pointer border border-slate-200 shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al Panel de Cursos</span>
                  </button>

                  <div className="text-xs text-slate-500 font-medium">
                    Curso seleccionado: <strong className="text-blue-950">{selectedCourse.name}</strong>
                  </div>
                </div>

                {/* Course Banner Header */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {selectedCourse.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Programa Académico
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-blue-950 tracking-tight">
                      {selectedCourse.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Asignaturas de este curso. Haz clic en una materia para abrir su portal de actividades evaluativas.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 self-start md:self-auto">
                    <div className="text-center px-3 border-r border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">Materias</div>
                      <div className="text-lg font-bold text-blue-950">{courseSubjects.length}</div>
                    </div>
                    <div className="text-center px-3">
                      <div className="text-xs text-slate-500 font-medium">Actividades</div>
                      <div className="text-lg font-bold text-blue-700">
                        {activities.filter((a) => courseSubjects.some((s) => s.id === a.subjectId)).length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects Grid */}
                {courseSubjects.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">No hay materias asignadas aún a este curso.</p>
                    <p className="text-xs text-slate-400 mt-1">El cuerpo docente o administrativo las registrará pronto.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                      Materias del Curso ({courseSubjects.length})
                    </p>

                    <div id="student-subjects-grid" className="flex flex-col gap-3.5">
                      {courseSubjects.map((sub) => {
                        const subActivities = activities
                          .filter((a) => a.subjectId === sub.id)
                          .sort((a, b) => a.order - b.order);
                        const completed = subActivities.filter((a) => a.status === 'Entregada' || a.examCompleted).length;

                        return (
                          <div
                            key={sub.id}
                            id={`subject-card-${sub.id}`}
                            onClick={() => setSelectedSubjectId(sub.id)}
                            className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 cursor-pointer group text-left relative overflow-hidden"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-blue-500 transition-colors"></div>
                            <div className="flex-1 min-w-0 pl-2">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                                  {sub.code}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {sub.credits} Créditos
                                </span>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {sub.weeklyHours}h semanales
                                </span>
                              </div>

                              <h3 className="font-bold text-blue-950 text-lg group-hover:text-blue-700 transition-colors">
                                {sub.name}
                              </h3>

                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                  <UserCheck className="w-4 h-4 text-blue-500" />
                                  <span className="font-medium text-slate-700">{sub.professor}</span>
                                </span>

                                <span className="inline-flex items-center gap-2">
                                  <Layers className="w-4 h-4 text-slate-400" />
                                  <span><strong className="text-slate-700">{subActivities.length}</strong> actividades</span>
                                  <span className="text-slate-300">|</span>
                                  <span className="font-semibold text-sky-600">{completed} entregadas</span>
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-3 self-end sm:self-center pt-3 sm:pt-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubjectId(sub.id);
                                }}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-br from-blue-900 to-sky-400 hover:bg-blue-700 text-white text-sm font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
                              >
                                <span>Entrar al aula</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* LEVEL 1: Panel de Cursos */
              <div id="student-courses-panel" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {studentCourses.map((course) => {
                    const cSubjects = subjects.filter(
                      (s) =>
                        s.courseId === course.id ||
                        (s.courseName && course.name && s.courseName.toLowerCase() === course.name.toLowerCase())
                    );
                    const cActivities = activities.filter((a) =>
                      cSubjects.some((s) => s.id === a.subjectId)
                    );
                    const cCompleted = cActivities.filter((a) => a.status === 'Entregada' || a.examCompleted).length;

                    return (
                      <div
                        key={course.id}
                        id={`student-course-card-${course.id}`}
                        onClick={() => setSelectedCourseId(course.id)}
                        className="bg-white border-2 border-slate-100 hover:border-blue-400 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group text-left relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-50 transition-colors"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
                              {course.code}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              ULEP Virtual
                            </span>
                          </div>

                          <h3 className="font-bold text-blue-950 text-xl group-hover:text-blue-700 transition-colors leading-snug mb-1">
                            {course.name}
                          </h3>

                          <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between text-sm text-slate-600">
                              <span className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">Materias asignadas:</span>
                              </span>
                              <strong className="font-bold text-blue-900 bg-slate-100 px-2 py-0.5 rounded-md">{cSubjects.length}</strong>
                            </div>

                            <div className="flex items-center justify-between text-sm text-slate-600">
                              <span className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">Actividades:</span>
                              </span>
                              <span className="font-medium text-slate-700">
                                {cActivities.length} <span className="text-xs text-slate-400">({cCompleted} entregadas)</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 mt-2 flex items-center justify-between relative z-10">
                          <span className="text-sm font-bold text-blue-700 flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                            <span>Ingresar al curso</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

{/* Tab 2: Grades */}
        {activeTab === 'grades' && (
          <div id="student-grades-table-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-700" />
                Historial de Calificaciones
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Consulta el detalle de tus evaluaciones: de qué asignatura son, cuándo se realizaron, el tipo de evaluación y la calificación obtenida.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 bg-slate-50 uppercase text-xs tracking-wider">
                    <th className="py-3 px-4 font-semibold rounded-tl-lg">Asignatura (De qué)</th>
                    <th className="py-3 px-4 font-semibold">Actividad (Qué)</th>
                    <th className="py-3 px-4 font-semibold">Tipo (Cómo)</th>
                    <th className="py-3 px-4 font-semibold">Fecha (Cuándo)</th>
                    <th className="py-3 px-4 font-semibold text-center">Peso</th>
                    <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Calificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activities
                    .filter(a => a.status === 'Calificada' || a.grade !== undefined || (a.type === 'Examen' && a.examCompleted && a.examScore !== undefined))
                    .filter(a => studentSubjects.some(s => s.id === a.subjectId))
                    .sort((a, b) => new Date(b.submittedAt || b.dueDate).getTime() - new Date(a.submittedAt || a.dueDate).getTime())
                    .map((g) => {
                      const subject = studentSubjects.find(s => s.id === g.subjectId);
                      const finalGrade = g.type === 'Examen' && g.examScore !== undefined ? (g.examScore / 100) * 5 : g.grade;
                      
                      return (
                        <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-blue-950">{subject?.name || 'Materia desconocida'}</span>
                              <span className="text-xs font-mono text-slate-500">{subject?.code}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-blue-900 line-clamp-2" title={g.title}>{g.title}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                              {g.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {g.submittedAt ? new Date(g.submittedAt).toLocaleDateString() : 'Sin fecha'}
                          </td>
                          <td className="py-3 px-4 text-center font-medium text-slate-600">
                            {g.weight}%
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-lg font-bold text-sm bg-sky-50 text-sky-700 border border-emerald-200">
                              {finalGrade?.toFixed(1) || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      );
                  })}
                  {activities.filter(a => a.status === 'Calificada' || a.grade !== undefined || (a.type === 'Examen' && a.examCompleted && a.examScore !== undefined)).filter(a => studentSubjects.some(s => s.id === a.subjectId)).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Award className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-medium">Aún no tienes calificaciones registradas.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
