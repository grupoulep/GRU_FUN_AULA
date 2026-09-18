import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, GraduationCap, School, X, Mail } from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { Activity, Subject, Course, StudentAdmission, Banner, SideAd, CentralAnnouncement } from './types';
import { useAcademicData } from './hooks/useAcademicData';

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

  const {
    courses, activities, subjects, students, banners, mainAds, centralAnnouncement, sideAd, recoveryRequests,
    addDocWithId, updateDocWithId, deleteDocWithId
  } = useAcademicData();
  
  const handleRequestRecovery = (identifier: string) => {
    const existing = recoveryRequests.find(req => req.identifier === identifier && req.status !== 'completed');
    if (existing) return;
    const id = `rec-${Date.now()}`;
    addDocWithId('recoveryRequests', id, { id, identifier, status: 'pending', requestDate: new Date().toISOString() });
  };
  const handleApproveRecovery = (id: string) => updateDocWithId('recoveryRequests', id, { status: 'approved' });
  const handleCompleteRecovery = (identifier: string, _newPass: string) => {
    const req = recoveryRequests.find(r => r.identifier === identifier && r.status === 'approved');
    if (req) {
      updateDocWithId('recoveryRequests', req.id, { status: 'completed' });
    }
  };
  
  const handleAddCourse = (c: Omit<Course, 'id'>) => { const id = `crs-${Date.now()}`; addDocWithId('courses', id, { ...c, id }); };
  const handleDeleteCourse = (id: string) => deleteDocWithId('courses', id);
  const handleUpdateCourse = (c: Course) => updateDocWithId('courses', c.id, c);
  
  const handleAddSubject = (s: Omit<Subject, 'id'>) => { const id = `sbj-${Date.now()}`; addDocWithId('subjects', id, { ...s, id }); };
  const handleDeleteSubject = (id: string) => deleteDocWithId('subjects', id);
  const handleUpdateSubject = (s: Subject) => updateDocWithId('subjects', s.id, s);
  
  const handleAddActivity = (a: Omit<Activity, 'id'>) => { const id = `act-${Date.now()}`; addDocWithId('activities', id, { ...a, id }); };
  const handleUpdateActivity = (a: Activity) => updateDocWithId('activities', a.id, a);
  const handleDeleteActivity = (id: string) => deleteDocWithId('activities', id);
  const handleSubmitActivity = (id: string, notes: string) => updateDocWithId('activities', id, { status: 'Entregada', submissionNotes: notes, submittedAt: new Date().toISOString() });
  
  const handleAddStudent = (s: Omit<StudentAdmission, 'id'>) => { const id = `std-${Date.now()}`; addDocWithId('students', id, { ...s, id }); };
  const handleUpdateStudent = (s: StudentAdmission) => updateDocWithId('students', s.id, s);
  const handleDeleteStudent = (id: string) => deleteDocWithId('students', id);

  const handleAddBanner = (b: Omit<Banner, 'id'>) => { const id = `banner-${Date.now()}`; addDocWithId('banners', id, { ...b, id }); };
  const handleUpdateBanner = (b: Banner) => updateDocWithId('banners', b.id, b);
  const handleDeleteBanner = (id: string) => deleteDocWithId('banners', id);

  const handleAddMainAd = (b: Omit<Banner, 'id'>) => { const id = `mainad-${Date.now()}`; addDocWithId('mainAds', id, { ...b, id }); };
  const handleUpdateMainAd = (b: Banner) => updateDocWithId('mainAds', b.id, b);
  const handleDeleteMainAd = (id: string) => deleteDocWithId('mainAds', id);

  const handleCentralAnnouncementChange = (announcement: CentralAnnouncement) => {
    addDocWithId('centralAnnouncement', 'singleton', announcement);
  };
  const handleSideAdChange = (sa: SideAd) => {
    addDocWithId('sideAds', 'singleton', sa);
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
        onCentralAnnouncementChange={handleCentralAnnouncementChange}
        sideAd={sideAd}
        onSideAdChange={handleSideAdChange}
        cedula={username}
        courses={courses}
        subjects={subjects}
        activities={activities}
        students={students}
        banners={banners}
        mainAds={mainAds}
        recoveryRequests={recoveryRequests}
        onApproveRecovery={handleApproveRecovery}
        onAddBanner={handleAddBanner}
        onUpdateBanner={handleUpdateBanner}
        onDeleteBanner={handleDeleteBanner}
        onAddMainAd={handleAddMainAd}
        onUpdateMainAd={handleUpdateMainAd}
        onDeleteMainAd={handleDeleteMainAd}
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
