import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, GraduationCap, School, X, Mail, CheckCircle2, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { Activity, Subject, Course, StudentAdmission, Teacher, Banner, SideAd, CentralAnnouncement, StudentGrade } from './types';
import { useAcademicData } from './hooks/useAcademicData';

type UserRole = 'admin' | 'student' | 'teacher';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  
  // Registration Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student');
  const [regFullName, setRegFullName] = useState('');
  const [regCedula, setRegCedula] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCourseId, setRegCourseId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccessData, setRegSuccessData] = useState<{ cedula: string; pass: string; name: string } | null>(null);

  // Recovery Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  const {
    courses, activities, subjects, students, teachers, grades, banners, mainAds, centralAnnouncement, sideAd, recoveryRequests,
    addDocWithId, updateDocWithId, deleteDocWithId, saveGrade, saveBulkGrades
  } = useAcademicData();
  
  const handleRequestRecovery = (identifier: string) => {
    const existing = recoveryRequests.find(req => req.identifier === identifier && req.status !== 'completed');
    if (existing) return;
    const id = `rec-${Date.now()}`;
    addDocWithId('recoveryRequests', id, { id, identifier, status: 'pending', requestDate: new Date().toISOString() });
  };

  const handleApproveRecovery = (id: string) => updateDocWithId('recoveryRequests', id, { status: 'approved' });

  const handleCompleteRecovery = (identifier: string, newPass: string) => {
    const cleanId = identifier.trim().toUpperCase();
    const req = recoveryRequests.find(r => r.identifier.trim().toUpperCase() === cleanId && r.status === 'approved');
    if (req) {
      updateDocWithId('recoveryRequests', req.id, { status: 'completed' });
    }
    // Update student password if match
    const student = students.find(s => s.cedula.trim().toUpperCase() === cleanId || s.email.trim().toUpperCase() === cleanId);
    if (student) {
      updateDocWithId('students', student.id, { initialPassword: newPass.trim() });
    }
    // Update teacher password if match
    const teacher = teachers.find(t => t.cedula.trim().toUpperCase() === cleanId || t.email.trim().toUpperCase() === cleanId);
    if (teacher) {
      updateDocWithId('teachers', teacher.id, { initialPassword: newPass.trim() });
    }
  };
  
  const handleAddCourse = (c: Omit<Course, 'id'>, initialSubjects?: Omit<Subject, 'id'>[]) => {
    const id = `crs-${Date.now()}`;
    addDocWithId('courses', id, { ...c, id });
    if (initialSubjects && initialSubjects.length > 0) {
      initialSubjects.forEach((sub, idx) => {
        const subId = `sbj-${Date.now()}-${idx}`;
        addDocWithId('subjects', subId, {
          ...sub,
          id: subId,
          courseId: id,
          courseName: c.name
        });
        if (sub.professorId) {
          const tch = teachers.find(t => t.id === sub.professorId);
          if (tch && !tch.courseIds?.includes(id)) {
            const newCourseIds = [...(tch.courseIds || []), id];
            const matchedCourses = courses.filter(crs => newCourseIds.includes(crs.id));
            updateDocWithId('teachers', tch.id, {
              courseIds: newCourseIds,
              courseName: [...matchedCourses.map(crs => crs.name), c.name].join(', ')
            });
          }
        }
      });
    }
  };
  const handleDeleteCourse = (id: string) => deleteDocWithId('courses', id);
  const handleUpdateCourse = (c: Course) => updateDocWithId('courses', c.id, c);
  
  const handleAddSubject = (s: Omit<Subject, 'id'>) => {
    const id = `sbj-${Date.now()}`;
    addDocWithId('subjects', id, { ...s, id });
    if (s.professorId && s.courseId) {
      const tch = teachers.find(t => t.id === s.professorId);
      if (tch && !tch.courseIds?.includes(s.courseId)) {
        const newCourseIds = [...(tch.courseIds || []), s.courseId];
        const matchedCourses = courses.filter(c => newCourseIds.includes(c.id));
        updateDocWithId('teachers', tch.id, {
          courseIds: newCourseIds,
          courseName: matchedCourses.map(c => c.name).join(', ')
        });
      }
    }
  };
  const handleDeleteSubject = (id: string) => deleteDocWithId('subjects', id);
  const handleUpdateSubject = (s: Subject) => {
    updateDocWithId('subjects', s.id, s);
    if (s.professorId && s.courseId) {
      const tch = teachers.find(t => t.id === s.professorId);
      if (tch && !tch.courseIds?.includes(s.courseId)) {
        const newCourseIds = [...(tch.courseIds || []), s.courseId];
        const matchedCourses = courses.filter(c => newCourseIds.includes(c.id));
        updateDocWithId('teachers', tch.id, {
          courseIds: newCourseIds,
          courseName: matchedCourses.map(c => c.name).join(', ')
        });
      }
    }
  };
  
  const handleAddActivity = (a: Omit<Activity, 'id'>) => { const id = `act-${Date.now()}`; addDocWithId('activities', id, { ...a, id }); };
  const handleUpdateActivity = (a: Activity) => updateDocWithId('activities', a.id, a);
  const handleDeleteActivity = (id: string) => deleteDocWithId('activities', id);
  const handleSubmitActivity = (id: string, notes: string) => updateDocWithId('activities', id, { status: 'Entregada', submissionNotes: notes, submittedAt: new Date().toISOString() });
  
  const handleAddStudent = (s: Omit<StudentAdmission, 'id'>) => { const id = `std-${Date.now()}`; addDocWithId('students', id, { ...s, id }); };
  const handleUpdateStudent = (s: StudentAdmission) => updateDocWithId('students', s.id, s);
  const handleDeleteStudent = (id: string) => deleteDocWithId('students', id);

  const handleAddTeacher = (t: Omit<Teacher, 'id'>) => { const id = `tch-${Date.now()}`; addDocWithId('teachers', id, { ...t, id }); };
  const handleUpdateTeacher = (t: Teacher) => updateDocWithId('teachers', t.id, t);
  const handleDeleteTeacher = (id: string) => deleteDocWithId('teachers', id);

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

  const handleQuickLogin = (role: UserRole) => {
    if (role === 'admin') {
      setUsername('ADMINIULEP');
      setPassword('ADMINIULEP');
      setErrorMessage('');
      setCurrentRole('admin');
    } else if (role === 'teacher') {
      const teacher = teachers[0] || { cedula: '1098765432', initialPassword: 'doc-1098765432' };
      const pass = teacher.initialPassword || `doc-${teacher.cedula}`;
      setUsername(teacher.cedula);
      setPassword(pass);
      setErrorMessage('');
      setCurrentRole('teacher');
    } else if (role === 'student') {
      const student = students[0] || { cedula: '1012345678', initialPassword: 'est-1012345678' };
      const pass = student.initialPassword || `est-${student.cedula}`;
      setUsername(student.cedula);
      setPassword(pass);
      setErrorMessage('');
      setCurrentRole('student');
    }
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

    // Check teacher credentials
    const teacherMatch = teachers.find(
      (t) => t.cedula.trim() === username.trim() || t.cedula.trim().toUpperCase() === cleanUser
    );
    if (teacherMatch) {
      const expectedPass = (teacherMatch.initialPassword || `doc-${teacherMatch.cedula}`).trim();
      if (password.trim() === expectedPass || password.trim().toUpperCase() === expectedPass.toUpperCase()) {
        setErrorMessage('');
        setCurrentRole('teacher');
        return;
      }
    }

    // Check student credentials
    const studentMatch = students.find(
      (s) => s.cedula.trim() === username.trim() || s.cedula.trim().toUpperCase() === cleanUser
    );
    if (studentMatch) {
      const expectedPass = (studentMatch.initialPassword || `est-${studentMatch.cedula}`).trim();
      if (password.trim() === expectedPass || password.trim().toUpperCase() === expectedPass.toUpperCase()) {
        setErrorMessage('');
        setCurrentRole('student');
        return;
      }
    }

    setErrorMessage(
      'Usuario o contraseña incorrectos. Verifique sus credenciales.'
    );
  };

  const handleSelfRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regCedula.trim()) return;

    const matchedCourse = courses.find((c) => c.id === regCourseId) || courses[0];
    const courseName = matchedCourse ? matchedCourse.name : 'Curso General';
    const finalCourseId = matchedCourse ? matchedCourse.id : (courses[0]?.id || 'general');

    if (regRole === 'student') {
      const finalPass = regPassword.trim() || `est-${regCedula.trim()}`;
      handleAddStudent({
        fullName: regFullName.trim(),
        cedula: regCedula.trim(),
        email: regEmail.trim() || `${regCedula.trim()}@ulep.edu.co`,
        phone: regPhone.trim(),
        courseId: finalCourseId,
        courseIds: [finalCourseId],
        courseName,
        admissionDate: new Date().toISOString().split('T')[0],
        registrationType: 'Matrícula',
        initialPassword: finalPass,
        status: 'Matriculado'
      });
      setRegSuccessData({
        cedula: regCedula.trim(),
        pass: finalPass,
        name: regFullName.trim()
      });
    } else {
      const finalPass = regPassword.trim() || `doc-${regCedula.trim()}`;
      handleAddTeacher({
        fullName: regFullName.trim(),
        cedula: regCedula.trim(),
        email: regEmail.trim() || `${regCedula.trim()}@ulep.edu.co`,
        phone: regPhone.trim(),
        courseIds: [finalCourseId],
        courseName,
        registrationDate: new Date().toISOString().split('T')[0],
        initialPassword: finalPass,
        status: 'Activo'
      });
      setRegSuccessData({
        cedula: regCedula.trim(),
        pass: finalPass,
        name: regFullName.trim()
      });
    }
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
        teachers={teachers}
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
        onUpdateSubject={handleUpdateSubject}
        onAddActivity={handleAddActivity}
        onUpdateActivity={handleUpdateActivity}
        onDeleteActivity={handleDeleteActivity}
        onAddStudent={handleAddStudent}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
        onAddTeacher={handleAddTeacher}
        onUpdateTeacher={handleUpdateTeacher}
        onDeleteTeacher={handleDeleteTeacher}
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
        teachers={teachers}
        grades={grades}
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
        teachers={teachers}
        courses={courses}
        subjects={subjects}
        activities={activities}
        students={students}
        grades={grades}
        onSaveBulkGrades={saveBulkGrades}
        onSaveGrade={saveGrade}
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
            <img src="/logofun01.png" alt="Fundación ULEP" className="h-[4.5rem] w-[131px] mx-auto mb-4 object-contain drop-shadow-sm" />
            <h1 className="text-xl font-bold text-blue-950">Portal Académico Integrado</h1>
            <p className="text-xs text-slate-500 mt-1">Ingresa con tus credenciales institucionales</p>
          </header>

          {/* Quick Access Bar (Removes friction & gaps) */}
          <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
              Acceso Rápido Directo
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-semibold text-blue-950 transition-all cursor-pointer text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher')}
                className="py-1.5 px-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-semibold text-blue-950 transition-all cursor-pointer text-center"
              >
                Profesor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="py-1.5 px-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-semibold text-blue-950 transition-all cursor-pointer text-center"
              >
                Estudiante
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              id="login-error-alert"
              role="alert"
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
            >
              {errorMessage}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div id="cedula-field-group">
              <label
                htmlFor="cedula-input"
                id="cedula-label"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Cédula o Usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" aria-hidden="true" />
                </span>
                <input
                  id="cedula-input"
                  name="cedula"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Ej: 1012345678"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-blue-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-colors"
                />
              </div>
            </div>

            <div id="password-field-group">
              <label
                htmlFor="password-input"
                id="password-label"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" aria-hidden="true" />
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-blue-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-colors"
                />
                <button
                  id="toggle-password-visibility-button"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              id="login-submit-button"
              type="submit"
              className="w-full py-2.5 px-6 mt-2 rounded-xl bg-gradient-to-r from-blue-900 to-sky-500 text-white font-semibold hover:from-blue-800 hover:to-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-sm text-sm"
            >
              Iniciar Sesión
            </button>
            
            <div className="flex items-center justify-between mt-4 text-xs">
              <button 
                type="button" 
                onClick={() => {
                  setShowForgotModal(true);
                  setRecoveryMessage('');
                  setRecoveryError('');
                }} 
                className="text-slate-500 hover:text-blue-700 font-medium transition-colors cursor-pointer"
              >
                ¿Olvidé mi contraseña?
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowRegisterModal(true);
                  setRegSuccessData(null);
                  if (!regCourseId && courses.length > 0) {
                    setRegCourseId(courses[0].id);
                  }
                }} 
                className="text-blue-700 hover:text-blue-900 font-bold transition-colors cursor-pointer"
              >
                Registrarme
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Interactive Self-Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-700" />
                <span>Registro Oficial de Usuario</span>
              </h3>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {regSuccessData ? (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-blue-950">¡Registro Exitoso!</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Tus credenciales institucionales han sido generadas y vinculadas al sistema:
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500">Nombre:</span>{' '}
                      <strong className="text-slate-800">{regSuccessData.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Usuario / Cédula:</span>{' '}
                      <strong className="text-blue-900 font-mono text-sm">{regSuccessData.cedula}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Contraseña asignada:</span>{' '}
                      <strong className="text-blue-900 font-mono text-sm">{regSuccessData.pass}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUsername(regSuccessData.cedula);
                      setPassword(regSuccessData.pass);
                      setShowRegisterModal(false);
                      setRegSuccessData(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Autocompletar e Iniciar Sesión</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSelfRegisterSubmit} className="space-y-3.5">
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setRegRole('student')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        regRole === 'student' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Soy Estudiante
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('teacher')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        regRole === 'teacher' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Soy Profesor / Docente
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Sofía Mendoza"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Cédula / Documento *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 1045987123"
                        value={regCedula}
                        onChange={(e) => setRegCedula(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono</label>
                      <input
                        type="text"
                        placeholder="Ej: 3101234567"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {regRole === 'student' ? 'Programa Académico a Matricular *' : 'Programa Asignado *'}
                    </label>
                    <select
                      value={regCourseId || courses[0]?.id || ''}
                      onChange={(e) => setRegCourseId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Contraseña Personalizada (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder={regRole === 'student' ? 'Por defecto: est-[cédula]' : 'Por defecto: doc-[cédula]'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowRegisterModal(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 cursor-pointer shadow-xs"
                    >
                      Completar Registro
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal (No window.alert / Fully connected) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-blue-950">Recuperación de Contraseña</h3>
              <button 
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotIdentifier('');
                  setNewPassword('');
                  setRepeatPassword('');
                  setRecoveryMessage('');
                  setRecoveryError('');
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {recoveryError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoveryMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{recoveryMessage}</span>
                </div>
              )}

              {(() => {
                const req = recoveryRequests.find(r => r.identifier.trim().toUpperCase() === forgotIdentifier.trim().toUpperCase() && r.status !== 'completed');
                
                if (req?.status === 'approved') {
                  return (
                    <div className="space-y-3">
                      <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                        ¡Solicitud aprobada por el administrador! Establece tu nueva contraseña:
                      </p>
                      <div>
                        <input
                          type="password"
                          placeholder="Nueva contraseña"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Repetir nueva contraseña"
                          value={repeatPassword}
                          onChange={e => setRepeatPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          if (newPassword.trim() === '') {
                            setRecoveryError('La contraseña no puede estar vacía');
                            return;
                          }
                          if (newPassword !== repeatPassword) {
                            setRecoveryError('Las contraseñas no coinciden');
                            return;
                          }
                          handleCompleteRecovery(forgotIdentifier, newPassword);
                          setRecoveryError('');
                          setRecoveryMessage('¡Contraseña actualizada exitosamente! Ahora puedes iniciar sesión con tu nueva clave.');
                          setTimeout(() => {
                            setShowForgotModal(false);
                            setUsername(forgotIdentifier);
                            setPassword(newPassword);
                          }, 2500);
                        }}
                        className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-medium hover:bg-emerald-600 transition-colors cursor-pointer text-xs shadow-xs"
                      >
                        Actualizar Contraseña
                      </button>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Ingresa tu cédula o correo registrado para enviar una solicitud de recuperación a la administración.
                    </p>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Ej: 1012345678"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                      />
                    </div>
                    {req?.status === 'pending' && (
                      <p className="text-xs text-amber-700 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        Tu solicitud está registrada y en espera de aprobación por el administrador en su panel.
                      </p>
                    )}
                    <button 
                      type="button"
                      onClick={() => {
                        if (forgotIdentifier.trim() === '') {
                          setRecoveryError('Por favor ingresa un número de cédula o correo válido');
                          return;
                        }
                        if (req?.status === 'pending') {
                          setRecoveryError('Ya tienes una solicitud pendiente en trámite');
                        } else {
                          handleRequestRecovery(forgotIdentifier.trim());
                          setRecoveryError('');
                          setRecoveryMessage('Solicitud enviada a la administración. Podrá ser aprobada desde el panel administrativo.');
                        }
                      }}
                      disabled={req?.status === 'pending'}
                      className={`w-full py-2.5 rounded-xl text-white font-semibold transition-colors text-xs shadow-xs ${
                        req?.status === 'pending' 
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-blue-900 hover:bg-blue-800 cursor-pointer'
                      }`}
                    >
                      {req?.status === 'pending' ? 'Solicitud en Revisión' : 'Enviar Solicitud a Administración'}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
