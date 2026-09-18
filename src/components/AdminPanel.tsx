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
import { Teacher, Course, Subject, StudentAdmission, AdminSection, Activity, Banner, CentralAnnouncement, PasswordRecoveryRequest, SideAd } from '../types';
import { Megaphone, Airplay, KeyRound, PanelLeft } from 'lucide-react';
import {
  INITIAL_COURSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_ACTIVITIES
} from '../data/initialAcademicData';
import { GlobalStudentSearch } from "./GlobalStudentSearch";
import { DashboardOverview } from './DashboardOverview';
import { CoursesSection } from './CoursesSection';
import { SubjectsSection } from './SubjectsSection';
import { UserRegistrationSection } from './UserRegistrationSection';
import { BannersSection } from './BannersSection';
import { CentralAnnouncementSection } from './CentralAnnouncementSection';
import { MainAdsSection } from './MainAdsSection';
import { PasswordRecoverySection } from './PasswordRecoverySection';
import { SideAdSection } from './SideAdSection';

export type { AdminSection };

interface AdminPanelProps {
  cedula: string;
  courses?: Course[];
  subjects?: Subject[];
  activities?: Activity[];
  students?: StudentAdmission[];
  teachers?: Teacher[];
  banners?: Banner[];
  recoveryRequests?: PasswordRecoveryRequest[];
  onApproveRecovery?: (id: string) => void;
  onBannersChange?: (banners: Banner[]) => void;
  mainAds?: Banner[];
  onAddMainAd?: (ad: Omit<Banner, 'id'>) => void;
  onUpdateMainAd?: (ad: Banner) => void;
  onDeleteMainAd?: (id: string) => void;
  sideAd?: SideAd;
  onSideAdChange?: (sideAd: SideAd) => void;
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
  onAddTeacher?: (newTeacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onDeleteTeacher?: (id: string) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  cedula,
  courses: externalCourses,
  subjects: externalSubjects,
  activities: externalActivities,
  students: externalStudents,
  teachers: externalTeachers,
  recoveryRequests,
  onApproveRecovery,
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  mainAds,
  onAddMainAd,
  onUpdateMainAd,
  onDeleteMainAd,
  sideAd,
  onSideAdChange,
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
  onAddTeacher: externalOnAddTeacher,
  onUpdateTeacher: externalOnUpdateTeacher,
  onDeleteTeacher: externalOnDeleteTeacher,
  onLogout
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Academic States (fall back to local if not provided by App)
  const [internalCourses, setInternalCourses] = useState<Course[]>(INITIAL_COURSES);
  const [internalSubjects, setInternalSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [internalActivities, setInternalActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [internalStudents, setInternalStudents] = useState<StudentAdmission[]>(INITIAL_STUDENTS);
  const [internalTeachers, setInternalTeachers] = useState<Teacher[]>([]);

  const courses = externalCourses || internalCourses;
  const subjects = externalSubjects || internalSubjects;
  const activities = externalActivities || internalActivities;
  const students = externalStudents || internalStudents;
  const teachers = externalTeachers || internalTeachers;

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
    if (externalOnAddStudent) {
      externalOnAddStudent({
        ...newStudentData,
        admissionDate: today
      });
    } else {
      const newStudent: StudentAdmission = {
        ...newStudentData,
        id: `std-${Date.now()}`,
        admissionDate: today
      };
      setInternalStudents((prev) => [newStudent, ...prev]);
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (externalOnDeleteStudent) {
      externalOnDeleteStudent(id);
    } else {
      setInternalStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleUpdateStudentStatus = (
    id: string,
    status: StudentAdmission['status']
  ) => {
    if (externalOnUpdateStudent) {
      const student = students.find((s) => s.id === id);
      if (student) {
        externalOnUpdateStudent({ ...student, status });
      }
    } else {
      setInternalStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    }
  };

  // Handlers for Teachers
  const handleAddTeacher = (
    newTeacherData: Omit<Teacher, 'id' | 'registrationDate'>
  ) => {
    const today = new Date().toISOString().split('T')[0];
    if (externalOnAddTeacher) {
      externalOnAddTeacher({
        ...newTeacherData,
        registrationDate: today
      });
    } else {
      const newTeacher: Teacher = {
        ...newTeacherData,
        id: `tch-${Date.now()}`,
        registrationDate: today
      };
      setInternalTeachers((prev) => [newTeacher, ...prev]);
    }
  };

  const handleDeleteTeacher = (id: string) => {
    if (externalOnDeleteTeacher) {
      externalOnDeleteTeacher(id);
    } else {
      setInternalTeachers((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleUpdateTeacherStatus = (
    id: string,
    status: Teacher['status']
  ) => {
    if (externalOnUpdateTeacher) {
      const teacher = teachers.find(t => t.id === id);
      if (teacher) {
        externalOnUpdateTeacher({ ...teacher, status });
      }
    } else {
      setInternalTeachers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    }
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
      label: 'Registrar Usuarios',
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
    },
    {
      id: 'publicidad-lateral',
      label: 'Publicidad Login',
      icon: PanelLeft
    },
    {
      id: 'recovery',
      label: 'Recuperación Usuarios',
      icon: KeyRound,
      count: recoveryRequests?.filter(r => r.status === 'pending').length || 0
    }
  ];

  return (
    <div
      id="admin-panel-container"
      className="min-h-screen w-full bg-slate-100 flex flex-col text-blue-900"
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
            className="md:hidden p-2 text-slate-600 hover:text-blue-950 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div id="admin-brand-badge" className="flex items-center gap-2.5">
            <img src="/logofun01.png" alt="Fundación ULEP" className="h-8 w-auto object-contain" />
          </div>
        </div>

        {/* Right side controls */}
        <div id="admin-user-controls" className="flex items-center gap-3">
          <GlobalStudentSearch students={students} />
          <div className="h-7 w-px bg-slate-200 hidden sm:block" />
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
      <div className="flex-1 flex w-full relative">
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Navigation Sidebar (Left Side) */}
        <aside
          id="admin-sidebar"
          className={`absolute md:relative inset-y-0 left-0 z-40 transform ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out h-full md:h-auto`}
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
                          ? 'bg-gradient-to-br from-blue-900 to-sky-400 text-white shadow-xs'
                          : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
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
                              ? 'bg-blue-900 text-slate-200'
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
          className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-start max-w-7xl mx-auto w-full overflow-hidden overflow-y-auto"
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
            <UserRegistrationSection
              students={students}
              teachers={teachers}
              courses={courses}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onUpdateStudentStatus={handleUpdateStudentStatus}
              onAddTeacher={handleAddTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onUpdateTeacherStatus={handleUpdateTeacherStatus}
            />
          )}

          {activeSection === 'banners' && (
            <BannersSection
              banners={banners || []}
              onAddBanner={onAddBanner}
              onUpdateBanner={onUpdateBanner}
              onDeleteBanner={onDeleteBanner}
            />
          )}

          {activeSection === 'publicidad-principal' && (
            <MainAdsSection
              mainAds={mainAds || []}
              onAddMainAd={onAddMainAd}
              onUpdateMainAd={onUpdateMainAd}
              onDeleteMainAd={onDeleteMainAd}
            />
          )}
          {activeSection === 'anuncio' && centralAnnouncement && onCentralAnnouncementChange && (
            <CentralAnnouncementSection
              announcement={centralAnnouncement}
              onUpdateAnnouncement={onCentralAnnouncementChange}
            />
          )}

          {activeSection === 'publicidad-lateral' && sideAd && onSideAdChange && (
            <SideAdSection
              sideAd={sideAd}
              onSideAdChange={onSideAdChange}
            />
          )}

          {activeSection === 'recovery' && (
            <PasswordRecoverySection
              recoveryRequests={recoveryRequests || []}
              onApproveRecovery={onApproveRecovery || (() => {})}
            />
          )}
        </main>
      </div>
    </div>
  );
};
