import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, GraduationCap, School, X, Mail } from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { Activity, Subject, Course, StudentAdmission, Banner, SideAd } from './types';
import { INITIAL_ACTIVITIES, INITIAL_SUBJECTS, INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_BANNERS, INITIAL_CENTRAL_ANNOUNCEMENT } from './data/initialAcademicData';
import { CentralAnnouncement } from './types';

type UserRole = 'admin' | 'student' | 'teacher';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

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
  
  // Side Ad state
  const [sideAd, setSideAd] = useState<SideAd>({ active: false, imageUrl: '' });
  
  // Password Recovery state
  const [recoveryRequests, setRecoveryRequests] = useState<PasswordRecoveryRequest[]>([]);
  
  const handleRequestRecovery = (identifier: string) => {
    setRecoveryRequests(prev => {
      // Check if already pending or approved
      const existing = prev.find(req => req.identifier === identifier && req.status !== 'completed');
      if (existing) return prev;
      
      const newReq: PasswordRecoveryRequest = {
        id: `rec-${Date.now()}`,
        identifier,
        status: 'pending',
        requestDate: new Date().toISOString()
      };
      return [newReq, ...prev];
    });
  };
  
  const handleApproveRecovery = (id: string) => {
    setRecoveryRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'approved' } : req)
    );
  };
  
  const handleCompleteRecovery = (identifier: string, newPassword: string) => {
    // We would actually update the student/teacher password here
    setRecoveryRequests(prev => 
      prev.map(req => req.identifier === identifier && req.status === 'approved' 
        ? { ...req, status: 'completed' } 
        : req
      )
    );
    // Note: since students/teachers don't have a mutable password array in this simplified mock,
    // we just mark the recovery as completed.
  };

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

    if (cleanUser === 'ADMINIULEP' && cleanPass === 'ADMINIULEP') {
      setErrorMessage('');
      setCurrentRole('admin');
      return;
    }

    setErrorMessage(
      'Usuario o contraseña incorrectos. Verifique sus credenciales.'
    );
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
        sideAd={sideAd}
        onSideAdChange={setSideAd}
        cedula={username}
        courses={courses}
        subjects={subjects}
        activities={activities}
        students={students}
        banners={banners}
        mainAds={mainAds}
        recoveryRequests={recoveryRequests}
        onApproveRecovery={handleApproveRecovery}
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
      className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 sm:p-6 text-blue-950"
    >
      <div className={`w-full ${sideAd.active && sideAd.imageUrl ? 'max-w-5xl md:grid md:grid-cols-2 bg-white rounded-2xl shadow-sm overflow-hidden' : 'max-w-md space-y-4'}`}>
        
        {/* Left Side Ad */}
        {sideAd.active && sideAd.imageUrl && (
          <div className="hidden md:block relative bg-slate-200">
            <img src={sideAd.imageUrl} alt="Publicidad" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        )}

        {/* Login Form Card */}
        <section
          id="login-card"
          className={`${sideAd.active && sideAd.imageUrl ? 'p-8 sm:p-12' : 'bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm'}`}
        >
          <header id="login-header" className="mb-6 text-center">
            <img src="/logofun01.png" alt="Fundación ULEP" className="h-[4.5rem] w-[131px] mx-auto mb-6 object-contain drop-shadow-sm" />
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
                Cédula
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
                  placeholder="Ingrese su cédula"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-blue-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-base transition-colors font-medium"
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
                  className="w-full pl-11 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-blue-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-base transition-colors"
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
              className="w-full py-3 px-6 mt-2 rounded-xl bg-gradient-to-r from-blue-900 to-sky-400 text-white font-medium hover:from-blue-800 hover:to-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer shadow-sm"
            >
              Iniciar Sesión
            </button>
            
            <div className="flex items-center justify-between mt-5 text-sm">
              <button 
                type="button" 
                onClick={() => setShowForgotModal(true)} 
                className="text-slate-500 hover:text-blue-700 font-medium transition-colors cursor-pointer"
              >
                ¿Olvidé mi contraseña?
              </button>
              <button 
                type="button" 
                onClick={() => setShowRegisterModal(true)} 
                className="text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer"
              >
                Registrarse
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-blue-950">Registro de Nuevo Usuario</h3>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                El proceso de registro está centralizado en el departamento de Admisiones. 
                <br/><br/>
                Si eres un nuevo estudiante o profesor, por favor contacta con administración para generar tus credenciales oficiales de acceso.
              </p>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="w-full py-2.5 mt-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-blue-950">Recuperar Contraseña</h3>
              <button 
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotIdentifier('');
                  setNewPassword('');
                  setRepeatPassword('');
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const req = recoveryRequests.find(r => r.identifier === forgotIdentifier && r.status !== 'completed');
                
                if (req?.status === 'approved') {
                  return (
                    <>
                      <p className="text-sm text-emerald-600 font-medium mb-2 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        Solicitud aprobada. Ingresa tu nueva contraseña y repítela por seguridad.
                      </p>
                      <div className="space-y-3">
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-5 h-5" aria-hidden="true" />
                          </span>
                          <input
                            type="password"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-colors"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-5 h-5" aria-hidden="true" />
                          </span>
                          <input
                            type="password"
                            placeholder="Repetir nueva contraseña"
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-colors"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (newPassword.trim() === '') {
                            alert('La contraseña no puede estar vacía');
                            return;
                          }
                          if (newPassword !== repeatPassword) {
                            alert('Las contraseñas no coinciden');
                            return;
                          }
                          handleCompleteRecovery(forgotIdentifier, newPassword);
                          alert('Contraseña cambiada exitosamente. Ahora puedes iniciar sesión.');
                          setShowForgotModal(false);
                          setForgotIdentifier('');
                          setNewPassword('');
                          setRepeatPassword('');
                        }}
                        className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium hover:from-emerald-500 hover:to-emerald-400 transition-colors cursor-pointer shadow-sm"
                      >
                        Cambiar Contraseña
                      </button>
                    </>
                  );
                }
                
                return (
                  <>
                    <p className="text-sm text-slate-600 mb-2">
                      Ingresa tu cédula o correo para solicitar recuperación. Si ya tienes una solicitud, ingresa tu cédula para revisar su estado.
                    </p>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <input
                        type="text"
                        placeholder="Correo o cédula..."
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-blue-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-colors"
                      />
                    </div>
                    {req?.status === 'pending' && (
                      <p className="text-xs text-amber-600 font-medium bg-amber-50 p-2 rounded-lg border border-amber-100">
                        Tu solicitud se encuentra en revisión por el administrador. Regresa más tarde.
                      </p>
                    )}
                    <button 
                      onClick={() => {
                        if (forgotIdentifier.trim() === '') {
                          alert('Por favor ingresa un identificador válido');
                          return;
                        }
                        if (req?.status === 'pending') {
                          alert('Ya tienes una solicitud pendiente de aprobación');
                        } else {
                          handleRequestRecovery(forgotIdentifier.trim());
                          alert('Reporte de recuperación enviado al administrador. Podrá aprobarlo desde su panel.');
                        }
                      }}
                      disabled={req?.status === 'pending'}
                      className={`w-full py-2.5 mt-2 rounded-xl text-white font-medium transition-colors shadow-sm ${
                        req?.status === 'pending' 
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-900 to-sky-400 hover:from-blue-800 hover:to-blue-700 cursor-pointer'
                      }`}
                    >
                      {req?.status === 'pending' ? 'Solicitud Pendiente' : 'Enviar Solicitud'}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
