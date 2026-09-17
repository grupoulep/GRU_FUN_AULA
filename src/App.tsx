import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, GraduationCap, School } from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { Activity, Subject, Course, StudentAdmission, Banner } from './types';
import { INITIAL_ACTIVITIES, INITIAL_SUBJECTS, INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_BANNERS, INITIAL_CENTRAL_ANNOUNCEMENT } from './data/initialAcademicData';
import { CentralAnnouncement } from './types';

type UserRole = 'admin' | 'student' | 'teacher';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  // Shared courses state across all portals
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  // Shared activities state editable by teachers and viewable/submittable by students
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);

  // Shared subjects state editable by teachers/admins and viewable across portals
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  // Shared students state to track admissions and assigned courses
  const [students, setStudents] = useState<StudentAdmission[]>(INITIAL_STUDENTS);

  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [mainAds, setMainAds] = useState<Banner[]>([]);
  const [centralAnnouncement, setCentralAnnouncement] = useState<CentralAnnouncement>(INITIAL_CENTRAL_ANNOUNCEMENT);

  const handleAddCourse = (newCourseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...newCourseData,
      id: `crs-${Date.now()}`
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };
  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  };


  const handleAddSubject = (newSubjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...newSubjectData,
      id: `sbj-${Date.now()}`
    };
    setSubjects((prev) => [newSubject, ...prev]);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
    );
  };

  const handleAddActivity = (act: Omit<Activity, 'id'>) => {
    const id = `act-${Date.now()}`;
    setActivities((prev) => [...prev, { ...act, id }]);
  };

  const handleUpdateActivity = (updatedAct: Activity) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === updatedAct.id ? updatedAct : a))
    );
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmitActivity = (activityId: string, notes: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              status: 'Entregada',
              submissionNotes: notes,
              submittedAt: new Date().toISOString()
            }
          : a
      )
    );
  };

  const handleAddStudent = (newStudentData: Omit<StudentAdmission, 'id'>) => {
    const newStudent: StudentAdmission = {
      ...newStudentData,
      id: `std-${Date.now()}`
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: StudentAdmission) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toUpperCase();
    const cleanPass = password.trim().toUpperCase();

    if (!cleanUser || !password.trim()) {
      setErrorMessage('Por favor ingrese su usuario y contraseña.');
      return;
    }

    if (cleanUser === 'ADMIN' && cleanPass === 'ADMIN') {
      setErrorMessage('');
      setCurrentRole('admin');
      return;
    }

    if (cleanUser === 'ESTU' && cleanPass === 'ESTU') {
      setErrorMessage('');
      setCurrentRole('student');
      return;
    }

    if (cleanUser === 'PRO' && cleanPass === 'PRO') {
      setErrorMessage('');
      setCurrentRole('teacher');
      return;
    }

    setErrorMessage(
      'Usuario o contraseña incorrectos. Verifique sus credenciales (ADMIN, ESTU o PRO).'
    );
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setUsername('');
    setPassword('');
    setErrorMessage('');
    setShowPassword(false);
  };

  if (currentRole === 'admin') {
    return (
      <AdminPanel
        centralAnnouncement={centralAnnouncement}
        onCentralAnnouncementChange={setCentralAnnouncement}
        cedula={username}
        courses={courses}
        subjects={subjects}
        activities={activities}
        students={students}
        banners={banners}
        mainAds={mainAds}
        onBannersChange={setBanners}
        onMainAdsChange={setMainAds}
        onAddCourse={handleAddCourse}
        onDeleteCourse={handleDeleteCourse}
            onUpdateCourse={handleUpdateCourse}
        onAddSubject={handleAddSubject}
        onDeleteSubject={handleDeleteSubject}
        onAddActivity={handleAddActivity}
        onUpdateActivity={handleUpdateActivity}
        onDeleteActivity={handleDeleteActivity}
        onAddStudent={handleAddStudent}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
        onLogout={handleLogout}
      />
    );
  }

  if (currentRole === 'student') {
    return (
      <StudentPortal
        centralAnnouncement={centralAnnouncement}
        username={username}
        courses={courses}
        subjects={subjects}
        activities={activities}
        students={students}
        banners={banners}
        mainAds={mainAds}
        onUpdateActivity={handleUpdateActivity}
        onSubmitActivity={handleSubmitActivity}
        onLogout={handleLogout}
      />
    );
  }

  if (currentRole === 'teacher') {
    return (
      <TeacherPortal
        username={username}
        courses={courses}
        subjects={subjects}
        activities={activities}
        students={students}
        onUpdateSubject={handleUpdateSubject}
        onAddActivity={handleAddActivity}
        onUpdateActivity={handleUpdateActivity}
        onDeleteActivity={handleDeleteActivity}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <main
      id="app-root"
      className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 sm:p-6 text-slate-900"
    >
      <div className="w-full max-w-md space-y-4">
        {/* Login Form Card */}
        <section
          id="login-card"
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <header id="login-header" className="mb-6 text-center">
            <div
              id="login-icon-badge"
              className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-700 to-teal-500 text-white flex items-center justify-center shadow-xs"
            >
              <User className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 id="login-title" className="text-2xl font-bold tracking-tight text-slate-900">
              Iniciar Sesión
            </h1>
            <p id="login-subtitle" className="text-slate-500 text-sm mt-1">
              Ingrese su usuario y contraseña para acceder al sistema
            </p>
          </header>

          {errorMessage && (
            <div
              id="login-error-alert"
              role="alert"
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm"
            >
              {errorMessage}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div id="cedula-field-group">
              <label
                htmlFor="cedula-input"
                id="cedula-label"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" aria-hidden="true" />
                </span>
                <input
                  id="cedula-input"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Ej: ADMIN, ESTU o PRO"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-base transition-colors font-medium"
                />
              </div>
            </div>

            <div id="password-field-group">
              <label
                htmlFor="password-input"
                id="password-label"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </span>
                <input
                  id="password-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Ingrese su contraseña"
                  className="w-full pl-11 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-base transition-colors"
                />
                <button
                  id="toggle-password-visibility-button"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              id="login-submit-button"
              type="submit"
              className="w-full py-3 px-6 mt-2 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 text-white font-medium hover:from-blue-800 hover:to-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer shadow-sm"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Quick Access Credentials Cards */}
          <div id="quick-credentials-container" className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Credenciales de Acceso Rápido
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* Admin */}
              <button
                type="button"
                id="btn-fill-admin"
                onClick={() => handleQuickLogin('ADMIN', 'ADMIN')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800 flex flex-col items-center text-center transition-all cursor-pointer"
                title="Autocompletar ADMIN / ADMIN"
              >
                <Shield className="w-4 h-4 text-slate-700 mb-1" />
                <span className="font-bold">ADMIN</span>
                <span className="text-[10px] text-slate-500">ADMIN</span>
              </button>

              {/* Estudiante */}
              <button
                type="button"
                id="btn-fill-estu"
                onClick={() => handleQuickLogin('ESTU', 'ESTU')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 hover:border-blue-300 text-blue-900 flex flex-col items-center text-center transition-all cursor-pointer"
                title="Autocompletar ESTU / ESTU"
              >
                <GraduationCap className="w-4 h-4 text-blue-600 mb-1" />
                <span className="font-bold">ESTU</span>
                <span className="text-[10px] text-blue-600">ESTU</span>
              </button>

              {/* Profesor */}
              <button
                type="button"
                id="btn-fill-pro"
                onClick={() => handleQuickLogin('PRO', 'PRO')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 hover:border-emerald-300 text-emerald-900 flex flex-col items-center text-center transition-all cursor-pointer"
                title="Autocompletar PRO / PRO"
              >
                <School className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="font-bold">PRO</span>
                <span className="text-[10px] text-emerald-700">PRO</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
