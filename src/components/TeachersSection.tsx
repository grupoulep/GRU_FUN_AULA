import React, { useState } from 'react';
import { Teacher, Course } from '../types';
import {
  UserPlus,
  UserCheck,
  Search,
  Trash2,
  Mail,
  IdCard,
  Phone,
  Key,
  CheckCircle2,
  Copy,
  Eye,
  X,
  FileBadge,
  GraduationCap
} from 'lucide-react';

interface TeachersSectionProps {
  teachers: Teacher[];
  courses: Course[];
  onAddTeacher: (teacher: Omit<Teacher, 'id' | 'registrationDate'>) => void;
  onDeleteTeacher: (id: string) => void;
  onUpdateStatus: (id: string, status: Teacher['status']) => void;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({
  teachers,
  courses,
  onAddTeacher,
  onDeleteTeacher,
  onUpdateStatus
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'registro' | 'admision'>('registro');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [typeFilter, setTypeFilter] = useState<string>('todos');

  // Selected teacher for detail view modal
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [status, setStatus] = useState<Teacher['status']>('Activo');
  
  const [initialPassword, setInitialPassword] = useState('');
  const [createdCredential, setCreatedCredential] = useState<{
    name: string;
    cedula: string;
    password?: string;
  } | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleOpenForm = (mode: 'registro' | 'admision') => {
    setFormMode(mode);
    setStatus('Activo');
    if (courses.length > 0 && courseIds.length === 0) {
      setCourseIds([courses[0].id]);
    }
    setShowForm(true);
  };

  const handleCedulaChange = (val: string) => {
    setCedula(val);
    if (!initialPassword || initialPassword.startsWith('doc-') || initialPassword.startsWith('est-')) {
      setInitialPassword(val ? `doc-${val.trim()}` : '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !cedula.trim()) return;

    const matchedCourse = courses.find(c => courseIds.includes(c.id)) || courses[0];
    const courseName = matchedCourse ? matchedCourse.name : 'Curso General';
    const finalCourseIds = courseIds.length > 0 ? courseIds : (matchedCourse ? [matchedCourse.id] : ['general']);
    const finalPassword = initialPassword.trim() || `doc-${cedula.trim()}`;

    onAddTeacher({
      fullName: fullName.trim(),
      cedula: cedula.trim(),
      email: email.trim() || `${cedula.trim()}@institucion.edu`,
      phone: phone.trim() || '',
      courseIds: finalCourseIds,
      courseName,
      initialPassword: finalPassword,
      status
    });

    setCreatedCredential({
      name: fullName.trim(),
      cedula: cedula.trim(),
      password: finalPassword
    });

    // Reset Form
    setFullName('');
    setCedula('');
    setEmail('');
    setPhone('');
    setInitialPassword('');
    setShowForm(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const filteredTeachers = teachers.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cedula.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || s.status === statusFilter;
    const matchesType = true;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div id="teachers-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            id="teachers-title"
            className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5"
          >
            <UserCheck className="w-6 h-6 text-slate-900" />
            <span>Admitir y Registrar Profesors</span>
          </h2>
          <p id="teachers-subtitle" className="text-sm text-slate-500 mt-0.5">
            Módulo para admitir postulantes y registrar formalmente a nuevos profesors con sus credenciales de acceso.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-register-teacher-mode"
            type="button"
            onClick={() => handleOpenForm('registro')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Profesor</span>
          </button>

          <button
            id="btn-admit-teacher-mode"
            type="button"
            onClick={() => handleOpenForm('admision')}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-slate-600" />
            <span>Admisión Rápida</span>
          </button>
        </div>
      </div>

      {/* Credential Created Banner */}
      {createdCredential && (
        <div
          id="teacher-credential-banner"
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-emerald-900">
                ¡Profesor registrado correctamente en el sistema!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                <strong>{createdCredential.name}</strong> • C.I: <span className="font-mono">{createdCredential.cedula}</span> • Clave inicial: <span className="font-mono font-bold bg-emerald-200/70 px-1.5 py-0.5 rounded">{createdCredential.password}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  `Cédula: ${createdCredential.cedula} | Clave: ${createdCredential.password}`
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedNotification ? '¡Copiado!' : 'Copiar Credenciales'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCreatedCredential(null)}
              className="p-1.5 text-emerald-700 hover:text-emerald-900 rounded-lg hover:bg-emerald-100/60 cursor-pointer"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form: Teacher Registration / Admission */}
      {showForm && (
        <section
          id="teacher-registration-form-card"
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs"
        >
          {/* Mode Switcher Tabs inside Form */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-slate-400">
                Tipo de Operación:
              </span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setFormMode('registro');
                    setStatus('Activo');
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    formMode === 'registro'
                      ? 'bg-gradient-to-r from-blue-700 to-teal-500 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Registro Completo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormMode('admision');
                    setStatus('Activo');
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    formMode === 'admision'
                      ? 'bg-gradient-to-r from-blue-700 to-teal-500 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admisión Rápida
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800 self-start sm:self-auto cursor-pointer"
            >
              Cerrar Formulario
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="teacher-name-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Nombres y Apellidos del Profesor *
                </label>
                <input
                  id="teacher-name-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Andrés Felipe Benítez Pérez"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Cedula */}
              <div>
                <label
                  htmlFor="teacher-cedula-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Cédula / Documento de Identidad *
                </label>
                <input
                  id="teacher-cedula-input"
                  type="text"
                  required
                  value={cedula}
                  onChange={(e) => handleCedulaChange(e.target.value)}
                  placeholder="Ej: 30455678"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="teacher-email-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  id="teacher-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    cedula ? `${cedula}@institucion.edu` : 'profesor@institucion.edu'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Phone (Only for Registro) */}
              <div>
                <label
                  htmlFor="teacher-phone-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Teléfono / Móvil de Contacto
                </label>
                <input
                  id="teacher-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+57 300 123 4567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Assigned Course */}
              <div>
                <label
                  htmlFor="teacher-course-select"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Curso / Programa Académico
                </label>
                <select
                  id="teacher-course-select"
                  multiple
                  value={courseIds}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                    setCourseIds(values);
                  }}
                  className="w-full h-32 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {courses.length === 0 ? (
                    <option value="general">Curso General (Sin cursos creados aún)</option>
                  ) : (
                    courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Código: {c.code})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Initial Password for Teacher Portal Access */}
              {formMode === 'registro' && (
                <div>
                  <label
                    htmlFor="teacher-password-input"
                    className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between"
                  >
                    <span>Contraseña Inicial de Acceso</span>
                    <span className="text-[10px] text-slate-400">Autogenerada</span>
                  </label>
                  <input
                    id="teacher-password-input"
                    type="text"
                    value={initialPassword}
                    onChange={(e) => setInitialPassword(e.target.value)}
                    placeholder="est-12345678"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <label
                  htmlFor="teacher-status-select"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Estado Académico
                </label>
                <select
                  id="teacher-status-select"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Teacher['status'])
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  <option value="Activo">Activo</option>
                  
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-submit-teacher"
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-teal-500 text-white text-xs font-medium hover:from-blue-800 hover:to-teal-600 cursor-pointer inline-flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>
                  {formMode === 'registro'
                    ? 'Completar Registro de Profesor'
                    : 'Guardar Admisión'}
                </span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Teachers Directory & Registrations Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">
              Profesors Registrados y Admitidos
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
              {teachers.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Status */}
            <select
              id="filter-teacher-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="todos">Todos los estados</option>
              <option value="Admitido">Admitidos</option>
              <option value="Matriculado">Matriculados</option>
              <option value="Pendiente">Pendientes</option>
            </select>

            {/* Filter by Registration Type */}
            <select
              id="filter-teacher-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="todos">Todos los trámites</option>
              <option value="Registro">Registros Regulares</option>
              <option value="Admisión">Admisiones</option>
              <option value="Matrícula">Matrículas</option>
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="search-teachers-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cédula o nombre..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No se encontraron profesors que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="teachers-table" className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                  <th className="py-2.5 px-3 font-semibold">Cédula</th>
                  <th className="py-2.5 px-3 font-semibold">Profesor</th>
                  <th className="py-2.5 px-3 font-semibold">Curso Asignado</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Trámite</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Estado</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((std) => (
                  <tr
                    key={std.id}
                    id={`teacher-row-${std.id}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Cedula */}
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <IdCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>{std.cedula}</span>
                      </div>
                    </td>

                    {/* Teacher Info */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{std.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {std.email}
                        </span>
                        {std.phone && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Phone className="w-3 h-3" />
                            {std.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3 px-3 text-slate-700">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]" title={std.courseName}>
                          {std.courseName}
                        </span>
                      </div>
                    </td>

                    {/* Registration Type Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-3 text-center">
                      <select
                        id={`select-status-${std.id}`}
                        value={std.status}
                        onChange={(e) =>
                          onUpdateStatus(
                            std.id,
                            e.target.value as Teacher['status']
                          )
                        }
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md border cursor-pointer focus:outline-none ${
                          std.status === 'Matriculado'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : std.status === 'Admitido'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Activo">Activo</option>
                        
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedTeacher(std)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Ver Ficha y Credenciales"
                          aria-label={`Ver ficha de ${std.fullName}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          id={`btn-delete-teacher-${std.id}`}
                          type="button"
                          onClick={() => onDeleteTeacher(std.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar registro"
                          aria-label={`Eliminar a ${std.fullName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Teacher Detail & Credential Modal */}
      {selectedTeacher && (
        <div
          id="teacher-detail-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-700 to-teal-500 text-white flex items-center justify-center">
                  <FileBadge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ficha del Profesor
                  </h3>
                  <span className="text-xs text-slate-500">
                    Registro académico institucional
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Profesor:</span>
                  <span className="font-bold text-slate-900">{selectedTeacher.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Cédula / Documento:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedTeacher.cedula}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Correo Institucional:</span>
                  <span className="text-slate-800">{selectedTeacher.email}</span>
                </div>
                {selectedTeacher.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Teléfono Móvil:</span>
                    <span className="text-slate-800">{selectedTeacher.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Programa Asignado:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">
                    {selectedTeacher.courseName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Fecha de Admisión:</span>
                  <span className="font-mono text-slate-700">{selectedTeacher.registrationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Tipo de Trámite:</span>
                  <span className="font-semibold text-slate-800">
                    
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Estado:</span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-200 text-slate-800">
                    {selectedTeacher.status}
                  </span>
                </div>
              </div>

              {/* Portal Credentials Section */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-900 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-700" />
                    Credenciales de Acceso al Portal
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `Usuario (C.I.): ${selectedTeacher.cedula}\nContraseña: ${
                          selectedTeacher.initialPassword || `est-${selectedTeacher.cedula}`
                        }`
                      )
                    }
                    className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedNotification ? '¡Copiado!' : 'Copiar Datos'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-amber-800/90 font-mono space-y-0.5">
                  <div>Usuario: <strong>{selectedTeacher.cedula}</strong></div>
                  <div>
                    Clave Inicial:{' '}
                    <strong>
                      {selectedTeacher.initialPassword || `est-${selectedTeacher.cedula}`}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="w-full py-2 bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
