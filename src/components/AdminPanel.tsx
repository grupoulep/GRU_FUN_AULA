import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  UserCheck,
  LogOut,
  Menu,
  X,
  FolderKanban,
  Image as ImageIcon
} from 'lucide-react';
import { Course, Subject, StudentAdmission, AdminSection, Activity, Banner, CentralAnnouncement } from '../types';
import { Megaphone, Airplay } from 'lucide-react';
import {
  INITIAL_COURSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_ACTIVITIES
} from '../data/initialAcademicData';
import { DashboardOverview } from './DashboardOverview';
import { CoursesSection } from './CoursesSection';
import { SubjectsSection } from './SubjectsSection';
import { StudentsSection } from './StudentsSection';
import { BannersSection } from './BannersSection';
import { CentralAnnouncementSection } from './CentralAnnouncementSection';
import { MainAdsSection } from './MainAdsSection';

export type { AdminSection };

interface AdminPanelProps {
  cedula: string;
  courses?: Course[];
  subjects?: Subject[];
  activities?: Activity[];
  students?: StudentAdmission[];
  banners?: Banner[];
  onBannersChange?: (banners: Banner[]) => void;
  mainAds?: Banner[];
  onMainAdsChange?: (ads: Banner[]) => void;
  centralAnnouncement?: CentralAnnouncement;
  onCentralAnnouncementChange?: (announcement: CentralAnnouncement) => void;
  onAddCourse?: (newCourse: Omit<Course, 'id'>) => void;
  onDeleteCourse?: (id: string) => void;
  onUpdateCourse?: (course: Course) => void;
  onAddSubject?: (newSubject: Omit<Subject, 'id'>) => void;
  onDeleteSubject?: (id: string) => void;
  onUpdateSubject?: (subject: Subject) => void;
  onAddActivity?: (act: Omit<Activity, 'id'>) => void;
  onUpdateActivity?: (act: Activity) => void;
  onDeleteActivity?: (id: string) => void;
  onAddStudent?: (newStudent: Omit<StudentAdmission, 'id'>) => void;
  onUpdateStudent?: (student: StudentAdmission) => void;
  onDeleteStudent?: (id: string) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  cedula,
  courses: externalCourses,
  subjects: externalSubjects,
  activities: externalActivities,
  students: externalStudents,
  banners,
  onBannersChange,
  mainAds,
  onMainAdsChange,
  centralAnnouncement,
  onCentralAnnouncementChange,
  onAddCourse: externalOnAddCourse,
  onDeleteCourse: externalOnDeleteCourse,
  onUpdateCourse: externalOnUpdateCourse,
  onAddSubject: externalOnAddSubject,
  onDeleteSubject: externalOnDeleteSubject,
  onUpdateSubject: externalOnUpdateSubject,
  onAddActivity: externalOnAddActivity,
  onUpdateActivity: externalOnUpdateActivity,
  onDeleteActivity: externalOnDeleteActivity,
  onAddStudent: externalOnAddStudent,
  onUpdateStudent: externalOnUpdateStudent,
  onDeleteStudent: externalOnDeleteStudent,
  onLogout
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Academic States (fall back to local if not provided by App)
  const [internalCourses, setInternalCourses] = useState<Course[]>(INITIAL_COURSES);
  const [internalSubjects, setInternalSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [internalActivities, setInternalActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [students, setStudents] = useState<StudentAdmission[]>(INITIAL_STUDENTS);

  const courses = externalCourses || internalCourses;
  const subjects = externalSubjects || internalSubjects;
  const activities = externalActivities || internalActivities;

  // Handlers for Courses
  const handleAddCourse = (newCourseData: Omit<Course, 'id'>) => {
    if (externalOnAddCourse) {
      externalOnAddCourse(newCourseData);
    } else {
      const newCourse: Course = {
        ...newCourseData,
        id: `crs-${Date.now()}`
      };
      setInternalCourses((prev) => [newCourse, ...prev]);
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (externalOnDeleteCourse) {
      externalOnDeleteCourse(id);
    } else {
      setInternalCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleUpdateCourse = (course: Course) => {
    if (externalOnUpdateCourse) {
      externalOnUpdateCourse(course);
    } else {
      setInternalCourses((prev) =>
        prev.map((c) => (c.id === course.id ? course : c))
      );
    }
  };

  // Handlers for Subjects
  const handleAddSubject = (newSubjectData: Omit<Subject, 'id'>) => {
    if (externalOnAddSubject) {
      externalOnAddSubject(newSubjectData);
    } else {
      const newSubject: Subject = {
        ...newSubjectData,
        id: `sbj-${Date.now()}`
      };
      setInternalSubjects((prev) => [newSubject, ...prev]);
    }
  };

  const handleDeleteSubject = (id: string) => {
    if (externalOnDeleteSubject) {
      externalOnDeleteSubject(id);
    } else {
      setInternalSubjects((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleUpdateSubject = (subject: Subject) => {
    if (externalOnUpdateSubject) {
      externalOnUpdateSubject(subject);
    } else {
      setInternalSubjects((prev) =>
        prev.map((s) => (s.id === subject.id ? subject : s))
      );
    }
  };

  // Handlers for Activities
  const handleAddActivity = (act: Omit<Activity, 'id'>) => {
    if (externalOnAddActivity) {
      externalOnAddActivity(act);
    } else {
      const newAct: Activity = {
        ...act,
        id: `act-${Date.now()}`
      };
      setInternalActivities((prev) => [newAct, ...prev]);
    }
  };

  const handleUpdateActivity = (act: Activity) => {
    if (externalOnUpdateActivity) {
      externalOnUpdateActivity(act);
    } else {
      setInternalActivities((prev) =>
        prev.map((a) => (a.id === act.id ? act : a))
      );
    }
  };

  const handleDeleteActivity = (id: string) => {
    if (externalOnDeleteActivity) {
      externalOnDeleteActivity(id);
    } else {
      setInternalActivities((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Handlers for Students
  const handleAddStudent = (
    newStudentData: Omit<StudentAdmission, 'id' | 'admissionDate'>
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newStudent: StudentAdmission = {
      ...newStudentData,
      id: `std-${Date.now()}`,
      admissionDate: today
    };

    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateStudentStatus = (
    id: string,
    status: StudentAdmission['status']
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const navItems: {
    id: AdminSection;
    label: string;
    icon: React.FC<{ className?: string }>;
    count?: number;
  }[] = [

    {
      id: 'dashboard',
      label: 'Resumen General',
      icon: LayoutDashboard
    },
    {
      id: 'courses',
      label: 'Crear Cursos',
      icon: GraduationCap,
      count: courses.length
    },
    {
      id: 'subjects',
      label: 'Agregar Materias',
      icon: BookOpen,
      count: subjects.length
    },
    {
      id: 'admissions',
      label: 'Admitir Estudiantes',
      icon: UserCheck,
      count: students.length
    },
    {
      id: 'banners',
      label: 'Banners Publicitarios',
      icon: ImageIcon,
      count: banners?.length || 0
    },
    {
      id: 'publicidad-principal',
      label: 'Publicidad Principal',
      icon: Airplay,
      count: mainAds?.length || 0
    }
  ];

  return (
    <div
      id="admin-panel-container"
      className="min-h-screen w-full bg-slate-100 flex flex-col text-slate-800"
    >
      {/* Top Admin Header */}
      <header
        id="admin-topbar"
        className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <button
            id="admin-mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div id="admin-brand-badge" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-700 to-teal-500 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-base leading-none">
                Panel Administrativo
              </span>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div id="admin-user-controls" className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Administrador
            </span>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <button
            id="admin-logout-button"
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* Admin Body: Sidebar + Main Area */}
      <div className="flex-1 flex w-full">
        {/* Navigation Sidebar (Left Side) */}
        <aside
          id="admin-sidebar"
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-4 z-20`}
        >
          <div className="space-y-6">
            <div>
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Gestión Académica
              </p>
              <nav id="admin-sidebar-nav" className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}-button`}
                      type="button"
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-br from-blue-700 to-teal-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-white' : 'text-slate-500'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.count === 'number' && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                            isActive
                              ? 'bg-slate-800 text-slate-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main
          id="admin-main-canvas"
          className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-start max-w-7xl mx-auto w-full"
        >

          {activeSection === 'dashboard' && (
            <DashboardOverview
              courses={courses}
              subjects={subjects}
              students={students}
              onNavigate={(section) => setActiveSection(section)}
            />
          )}

          {activeSection === 'courses' && (
            <CoursesSection
              courses={courses}
              onAddCourse={handleAddCourse}
              onDeleteCourse={handleDeleteCourse}
              onUpdateCourse={handleUpdateCourse}
            />
          )}

          {activeSection === 'subjects' && (
            <SubjectsSection
              subjects={subjects}
              courses={courses}
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {activeSection === 'admissions' && (
            <StudentsSection
              students={students}
              courses={courses}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onUpdateStatus={handleUpdateStudentStatus}
            />
          )}

          {activeSection === 'banners' && (
            <BannersSection
              banners={banners || []}
              onBannersChange={onBannersChange || (() => {})}
            />
          )}
                    {activeSection === 'publicidad-principal' && (
            <MainAdsSection
              mainAds={mainAds || []}
              onMainAdsChange={onMainAdsChange || (() => {})}
            />
          )}
          {activeSection === 'anuncio' && centralAnnouncement && onCentralAnnouncementChange && (
            <CentralAnnouncementSection
              announcement={centralAnnouncement}
              onUpdateAnnouncement={onCentralAnnouncementChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};
