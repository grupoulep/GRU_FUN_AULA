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
  FolderKanban,
  Check,
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Subject, Activity, Course, StudentAdmission, Banner, CentralAnnouncement, StudentGrade, Teacher } from '../types';
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
  teachers?: Teacher[];
  grades?: StudentGrade[];
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
  teachers = [],
  grades = [],
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

  // Find the current student cleanly
  const currentStudent = students.find(
    (s) =>
      s.cedula.trim().toUpperCase() === username.trim().toUpperCase() ||
      s.id === username
  );

  // Filter courses based on student's assigned courses (if found, otherwise show all for fallback)
  const studentCourses = currentStudent
    ? courses.filter(
        (c) =>
          c.id === currentStudent.courseId ||
          (currentStudent.courseIds && currentStudent.courseIds.includes(c.id)) ||
          (currentStudent.courseName && c.name.toLowerCase() === currentStudent.courseName.toLowerCase()) ||
          (currentStudent.courseName && currentStudent.courseName.toLowerCase().includes(c.name.toLowerCase()))
      )
    : courses;

  // Active course and its subjects
  const selectedCourse = studentCourses.find((c) => c.id === selectedCourseId) || null;
  const studentSubjects = studentCourses.flatMap((c) =>
    subjects.filter(
      (s) =>
        s.courseId === c.id ||
        (s.courseName && c.name && s.courseName.toLowerCase() === c.name.toLowerCase())
    )
  );

  // Calculate current student GPA for quick preview
  const studentGradesList = currentStudent
    ? grades.filter(g => g.studentId === currentStudent.id || g.studentCedula === currentStudent.cedula)
    : grades;
  const gradedSubjects = studentSubjects.map(sub => {
    const gr = studentGradesList.find(g => g.subjectId === sub.id);
    return gr?.definitiva;
  }).filter((d): d is number => d !== undefined && d !== null);
  const currentGPA = gradedSubjects.length > 0
    ? (gradedSubjects.reduce((acc, v) => acc + v, 0) / gradedSubjects.length).toFixed(1)
    : null;

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
        
        {/* Central Announcement Banner */}
        {showAnnouncement && centralAnnouncement?.active && (
          <div id="student-central-announcement" className="bg-gradient-to-r from-blue-900 to-sky-700 text-white p-5 rounded-2xl shadow-sm flex items-start justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                <Megaphone className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-white">{centralAnnouncement.title}</h3>
                <p className="text-xs text-sky-100 mt-1 leading-relaxed">{centralAnnouncement.content}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAnnouncement(false)} 
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Banners Carousel */}
        <StudentBannerCarousel banners={banners} />

        {/* Student Welcome Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentStudent?.status || 'Matriculado'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">
                Cédula: {currentStudent?.cedula || username}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-950">
              {currentStudent?.fullName ? `Hola, ${currentStudent.fullName}` : 'Bienvenido a tu Aula Virtual'}
            </h1>
            <p className="text-xs text-slate-500">
              {studentCourses.length > 0
                ? `Inscrito en: ${studentCourses.map(c => c.name).join(' • ')}`
                : 'Accede a tus asignaturas y revisa tus calificaciones actualizadas en tiempo real.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {currentGPA !== null && (
              <div 
                onClick={() => { setActiveTab('grades'); setSelectedSubjectId(null); }}
                className="text-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl cursor-pointer transition-all"
                title="Ver planilla de calificaciones"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-extrabold text-emerald-800 font-mono">{currentGPA}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">/5.0</span>
                </div>
                <span className="text-[10px] text-emerald-700 uppercase font-bold flex items-center justify-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>Promedio</span>
                </span>
              </div>
            )}
            <div className="text-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="block text-lg font-bold text-blue-950">{studentCourses.length}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Programas</span>
            </div>
            <div className="text-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="block text-lg font-bold text-blue-950">{studentSubjects.length}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Materias</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div id="student-portal-tabs" className="flex flex-wrap border-b border-slate-200 gap-2">
          <button
            id="tab-subjects"
            type="button"
            onClick={() => {
              setActiveTab('subjects');
              setSelectedSubjectId(null);
            }}
            className={`py-2 px-4 text-sm font-semibold transition-all cursor-pointer rounded-xl flex items-center gap-2 ${
              activeTab === 'subjects'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-blue-900 hover:bg-slate-200/50'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Mis Cursos y Asignaturas ({studentCourses.length})</span>
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
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-blue-900 hover:bg-slate-200/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Planilla de Calificaciones</span>
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
              /* LEVEL 2: Asignaturas del Curso Seleccionado */
              <div id="student-course-subjects-view" className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    id="btn-back-to-courses"
                    type="button"
                    onClick={() => setSelectedCourseId(null)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-blue-900 hover:text-blue-700 bg-white hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-all w-fit cursor-pointer border border-slate-200 shadow-xs"
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
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                      {selectedCourse.code}
                    </span>
                    <h2 className="text-xl font-black text-blue-950 mt-2">{selectedCourse.name}</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Explora los contenidos de las asignaturas, interactúa con tus docentes y resuelve tus talleres y exámenes.
                    </p>
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
                            className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 cursor-pointer group text-left relative overflow-hidden"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-900 group-hover:bg-sky-500 transition-colors"></div>
                            <div className="flex-1 min-w-0 pl-2">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                                  {sub.code}
                                </span>
                                <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
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

                              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                                  <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                                  <span className="font-medium text-slate-800">{sub.professor}</span>
                                </span>

                                <span className="inline-flex items-center gap-2">
                                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                                  <span><strong className="text-slate-800">{subActivities.length}</strong> actividades</span>
                                  <span className="text-slate-300">|</span>
                                  <span className="font-semibold text-emerald-700">{completed} completadas</span>
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
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                              >
                                <span>Ver Actividades</span>
                                <ChevronRight className="w-4 h-4" />
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
              /* LEVEL 1: Programas Inscritos */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-blue-950">
                    Tus Programas Académicos Inscritos ({studentCourses.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {studentCourses.map((course) => {
                    const cSubjects = subjects.filter(
                      (s) => s.courseId === course.id || (s.courseName && s.courseName.toLowerCase() === course.name.toLowerCase())
                    );

                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                              {course.code}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Inscrito
                            </span>
                          </div>
                          <h3 className="font-bold text-blue-950 text-lg group-hover:text-blue-700 transition-colors">
                            {course.name}
                          </h3>
                        </div>

                        <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{cSubjects.length} Asignaturas</span>
                          <span className="text-blue-700 font-bold group-hover:translate-x-0.5 transition-transform">
                            Acceder al Curso →
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
          <div id="student-grades-table-card" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-700" />
                  <span>Historial y Planilla de Calificaciones</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Consulta tus notas oficiales por cortes (30%, 30%, 40%) emitidas por tus docentes, así como las evaluaciones individuales completadas.
                </p>
              </div>
            </div>

            {/* Section A: Official Subject Grades */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
                Calificaciones Oficiales por Asignatura
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                      <th className="py-3 px-4 font-semibold">Código</th>
                      <th className="py-3 px-4 font-semibold">Asignatura</th>
                      <th className="py-3 px-4 font-semibold">Docente</th>
                      <th className="py-3 px-4 font-semibold text-center">Corte 1 (30%)</th>
                      <th className="py-3 px-4 font-semibold text-center">Corte 2 (30%)</th>
                      <th className="py-3 px-4 font-semibold text-center">Corte 3 (40%)</th>
                      <th className="py-3 px-4 font-semibold text-center">Definitiva</th>
                      <th className="py-3 px-4 font-semibold text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {studentSubjects.map((sub) => {
                      // Find student's grade for this subject
                      const gradeRecord = grades.find(
                        (g) =>
                          g.subjectId === sub.id &&
                          (currentStudent ? (g.studentId === currentStudent.id || g.studentCedula === currentStudent.cedula) : true)
                      );

                      const c1 = gradeRecord?.corte1;
                      const c2 = gradeRecord?.corte2;
                      const c3 = gradeRecord?.corte3;
                      const def = gradeRecord?.definitiva;
                      const isPassing = def !== undefined ? def >= 3.0 : null;

                      return (
                        <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-slate-700">{sub.code}</td>
                          <td className="py-3 px-4 font-semibold text-blue-950">{sub.name}</td>
                          <td className="py-3 px-4 text-slate-700">{sub.professor}</td>
                          
                          <td className="py-3 px-4 text-center font-semibold text-slate-800">
                            {c1 !== undefined ? c1.toFixed(1) : <span className="text-slate-400 font-normal">-</span>}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-800">
                            {c2 !== undefined ? c2.toFixed(1) : <span className="text-slate-400 font-normal">-</span>}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-800">
                            {c3 !== undefined ? c3.toFixed(1) : <span className="text-slate-400 font-normal">-</span>}
                          </td>

                          <td className="py-3 px-4 text-center">
                            {def !== undefined ? (
                              <span className={`inline-block font-bold text-sm px-2.5 py-0.5 rounded-lg ${
                                isPassing ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'
                              }`}>
                                {def.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            {def !== undefined ? (
                              isPassing ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <Check className="w-3 h-3" />
                                  <span>Aprobada</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Reprobada</span>
                                </span>
                              )
                            ) : (
                              <span className="text-slate-500 text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                En Curso
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {studentSubjects.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No tienes asignaturas registradas actualmente.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section B: Individual Evaluations & Exam Results */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
                Evaluaciones, Talleres y Exámenes Realizados
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                      <th className="py-3 px-4 font-semibold">Asignatura</th>
                      <th className="py-3 px-4 font-semibold">Actividad</th>
                      <th className="py-3 px-4 font-semibold">Tipo</th>
                      <th className="py-3 px-4 font-semibold">Fecha</th>
                      <th className="py-3 px-4 font-semibold text-center">Peso</th>
                      <th className="py-3 px-4 font-semibold text-right">Nota / Puntuación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
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
                              <span className="font-semibold text-blue-950">{subject?.name || 'Materia'}</span>
                              <span className="block text-[11px] font-mono text-slate-500">{subject?.code}</span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">{g.title}</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                {g.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {g.submittedAt ? new Date(g.submittedAt).toLocaleDateString() : 'Entregado'}
                            </td>
                            <td className="py-3 px-4 text-center font-semibold text-slate-700">{g.weight}%</td>
                            <td className="py-3 px-4 text-right">
                              <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-xs bg-sky-50 text-sky-800 border border-sky-200">
                                {finalGrade !== undefined ? finalGrade.toFixed(1) : (g.examScore ? `${g.examScore}%` : 'Entregado')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                    {activities.filter(a => a.status === 'Calificada' || a.grade !== undefined || (a.type === 'Examen' && a.examCompleted && a.examScore !== undefined)).filter(a => studentSubjects.some(s => s.id === a.subjectId)).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Aún no tienes evaluaciones individuales calificadas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
