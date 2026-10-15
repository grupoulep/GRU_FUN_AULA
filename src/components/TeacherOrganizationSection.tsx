import React, { useState } from 'react';
import { Teacher, Course, Subject, StudentAdmission } from '../types';
import {
  Users,
  GraduationCap,
  BookOpen,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Edit2,
  Copy,
  ExternalLink,
  Layers,
  FileText,
  UserCheck,
  X,
  Plus,
  Phone,
  Mail,
  IdCard,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';

interface TeacherOrganizationSectionProps {
  teachers: Teacher[];
  courses: Course[];
  subjects: Subject[];
  students?: StudentAdmission[];
  onUpdateTeacher: (teacher: Teacher) => void;
  onUpdateSubject: (subject: Subject) => void;
  onNavigateToSubjects?: () => void;
  onNavigateToCourses?: () => void;
}

export const TeacherOrganizationSection: React.FC<TeacherOrganizationSectionProps> = ({
  teachers,
  courses,
  subjects,
  students = [],
  onUpdateTeacher,
  onUpdateSubject,
  onNavigateToSubjects,
  onNavigateToCourses
}) => {
  const [viewMode, setViewMode] = useState<'byTeacher' | 'byCourse'>('byTeacher');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Activo' | 'Inactivo'>('todos');
  const [assignmentFilter, setAssignmentFilter] = useState<'todos' | 'conMaterias' | 'sinMaterias'>('todos');

  // Modals state
  const [managingTeacher, setManagingTeacher] = useState<Teacher | null>(null);
  const [selectedCoursesForTeacher, setSelectedCoursesForTeacher] = useState<string[]>([]);
  const [selectedSubjectsForTeacher, setSelectedSubjectsForTeacher] = useState<string[]>([]);

  const [accessDetailTeacher, setAccessDetailTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editCedula, setEditCedula] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editStatus, setEditStatus] = useState<Teacher['status']>('Activo');

  const [copiedNote, setCopiedNote] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(label);
    setTimeout(() => setCopiedNote(''), 2500);
  };

  // Helper to get subjects assigned to a teacher
  const getTeacherSubjects = (teacher: Teacher) => {
    return subjects.filter((s) => {
      const isDirectProf =
        (s.professorCedula && s.professorCedula.trim() === teacher.cedula.trim()) ||
        (s.professorId && s.professorId === teacher.id) ||
        (s.professor && teacher.fullName && s.professor.trim().toLowerCase() === teacher.fullName.trim().toLowerCase()) ||
        (teacher.fullName && s.professor && teacher.fullName.toLowerCase().includes(s.professor.toLowerCase()));
      return isDirectProf;
    });
  };

  // Helper to count students in teacher's assigned courses
  const getTeacherStudentCount = (teacher: Teacher) => {
    const courseIds = teacher.courseIds || [];
    if (courseIds.length === 0) return 0;
    return students.filter(
      (s) => courseIds.includes(s.courseId) || (s.courseIds && s.courseIds.some((cId) => courseIds.includes(cId)))
    ).length;
  };

  // Calculations for KPIs
  const totalTeachers = teachers.length;
  const teachersWithSubjects = teachers.filter((t) => getTeacherSubjects(t).length > 0).length;
  const subjectsWithProfessors = subjects.filter(
    (s) => s.professor && s.professor !== 'Docente por asignar' && s.professor.trim() !== ''
  ).length;
  const coveragePercent = subjects.length > 0 ? Math.round((subjectsWithProfessors / subjects.length) * 100) : 0;

  // Filtered teachers
  const filteredTeachers = teachers.filter((t) => {
    const teacherSubjects = getTeacherSubjects(t);
    const matchesSearch =
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cedula.includes(searchTerm) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.courseName && t.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      teacherSubjects.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'todos' || t.status === statusFilter;
    const matchesAssignment =
      assignmentFilter === 'todos' ||
      (assignmentFilter === 'conMaterias' && teacherSubjects.length > 0) ||
      (assignmentFilter === 'sinMaterias' && teacherSubjects.length === 0);

    return matchesSearch && matchesStatus && matchesAssignment;
  });

  // Open Assignment Manager Modal
  const handleOpenManageAssignments = (teacher: Teacher) => {
    setManagingTeacher(teacher);
    setSelectedCoursesForTeacher(teacher.courseIds || []);
    const assignedSubIds = getTeacherSubjects(teacher).map((s) => s.id);
    setSelectedSubjectsForTeacher(assignedSubIds);
  };

  // Save Assignment changes
  const handleSaveAssignments = () => {
    if (!managingTeacher) return;

    // 1. Update teacher's courses
    const matchedCourses = courses.filter((c) => selectedCoursesForTeacher.includes(c.id));
    const courseNames = matchedCourses.map((c) => c.name).join(', ') || 'Sin cursos asignados';

    const updatedTeacher: Teacher = {
      ...managingTeacher,
      courseIds: selectedCoursesForTeacher,
      courseName: courseNames
    };
    onUpdateTeacher(updatedTeacher);

    // 2. Update subjects
    // A. For subjects selected for this teacher -> set professor details
    subjects.forEach((s) => {
      const isSelected = selectedSubjectsForTeacher.includes(s.id);
      const wasAssignedToThis =
        (s.professorCedula && s.professorCedula.trim() === managingTeacher.cedula.trim()) ||
        (s.professorId && s.professorId === managingTeacher.id) ||
        (s.professor && s.professor.trim().toLowerCase() === managingTeacher.fullName.trim().toLowerCase());

      if (isSelected && !wasAssignedToThis) {
        onUpdateSubject({
          ...s,
          professor: managingTeacher.fullName,
          professorId: managingTeacher.id,
          professorCedula: managingTeacher.cedula
        });
      } else if (!isSelected && wasAssignedToThis) {
        // Unassign this teacher
        onUpdateSubject({
          ...s,
          professor: 'Docente por asignar',
          professorId: undefined,
          professorCedula: undefined
        });
      }
    });

    setManagingTeacher(null);
    showToast(`¡Asignaciones de ${managingTeacher.fullName} actualizadas con éxito!`);
  };

  // Open Edit Teacher Modal
  const handleOpenEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setEditFullName(teacher.fullName);
    setEditCedula(teacher.cedula);
    setEditEmail(teacher.email);
    setEditPhone(teacher.phone || '');
    setEditPassword(teacher.initialPassword || `doc-${teacher.cedula}`);
    setEditStatus(teacher.status);
  };

  const handleSaveEditTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher || !editFullName.trim() || !editCedula.trim()) return;

    const updated: Teacher = {
      ...editingTeacher,
      fullName: editFullName.trim(),
      cedula: editCedula.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      initialPassword: editPassword.trim(),
      status: editStatus
    };

    onUpdateTeacher(updated);

    // If teacher's name or cedula changed, propagate to subjects they teach
    subjects.forEach((s) => {
      const isTheirSubject =
        s.professorId === editingTeacher.id ||
        s.professorCedula === editingTeacher.cedula ||
        s.professor === editingTeacher.fullName;
      if (isTheirSubject) {
        onUpdateSubject({
          ...s,
          professor: updated.fullName,
          professorId: updated.id,
          professorCedula: updated.cedula
        });
      }
    });

    setEditingTeacher(null);
    showToast('¡Datos del profesor actualizados exitosamente!');
  };

  // Reassign single subject from the byCourse matrix
  const handleQuickReassignSubject = (subject: Subject, teacherId: string) => {
    if (!teacherId || teacherId === 'none') {
      onUpdateSubject({
        ...subject,
        professor: 'Docente por asignar',
        professorId: undefined,
        professorCedula: undefined
      });
      showToast(`Materia "${subject.name}" quedó sin docente asignado.`);
      return;
    }

    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    onUpdateSubject({
      ...subject,
      professor: teacher.fullName,
      professorId: teacher.id,
      professorCedula: teacher.cedula
    });

    // Also ensure this course is in teacher.courseIds if missing
    if (subject.courseId && !teacher.courseIds?.includes(subject.courseId)) {
      const newCourseIds = [...(teacher.courseIds || []), subject.courseId];
      const matchedCourses = courses.filter((c) => newCourseIds.includes(c.id));
      onUpdateTeacher({
        ...teacher,
        courseIds: newCourseIds,
        courseName: matchedCourses.map((c) => c.name).join(', ')
      });
    }

    showToast(`Materia "${subject.name}" asignada a ${teacher.fullName}`);
  };

  return (
    <div id="teacher-organization-section" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            id="teacher-org-title"
            className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5"
          >
            <Users className="w-6 h-6 text-blue-700" />
            <span>Organización de Materias y Cursos por Profesor</span>
          </h2>
          <p id="teacher-org-subtitle" className="text-sm text-slate-500 mt-0.5">
            Estructura curricular directa: consulta qué cursos y materias imparte cada docente y los accesos específicos que tiene en el portal.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('byTeacher')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'byTeacher'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Vista por Profesor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('byCourse')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'byCourse'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Matriz Curricular por Curso</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Docentes Registrados
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {totalTeachers}
            </span>
            <span className="text-[11px] text-slate-500">
              {teachers.filter((t) => t.status === 'Activo').length} activos en plataforma
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Docentes con Materias
            </span>
            <span className="text-2xl font-bold text-blue-900 mt-1 block">
              {teachersWithSubjects} <span className="text-xs font-normal text-slate-400">/ {totalTeachers}</span>
            </span>
            <span className="text-[11px] text-slate-500">
              {totalTeachers - teachersWithSubjects > 0 ? (
                <span className="text-amber-600 font-medium">
                  {totalTeachers - teachersWithSubjects} sin materias asignadas
                </span>
              ) : (
                <span className="text-emerald-600 font-medium">100% con carga horaria</span>
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Materias Asignadas
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {subjectsWithProfessors} <span className="text-xs font-normal text-slate-400">/ {subjects.length}</span>
            </span>
            <span className="text-[11px] text-slate-500">
              {subjects.length - subjectsWithProfessors > 0 ? (
                <span className="text-rose-600 font-medium">
                  {subjects.length - subjectsWithProfessors} materias por asignar
                </span>
              ) : (
                <span className="text-emerald-600 font-medium">Todas cubiertas</span>
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Cobertura Académica
            </span>
            <span className="text-2xl font-bold text-teal-900 mt-1 block">
              {coveragePercent}%
            </span>
            <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-700 to-teal-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar docente por nombre, cédula, curso o materia..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === 'byTeacher' && (
            <>
              <select
                aria-label="Filtrar por estado del docente"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="Activo">Solo Activos</option>
                <option value="Inactivo">Solo Inactivos</option>
              </select>

              <select
                aria-label="Filtrar por asignación de materias"
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="todos">Todas las asignaciones</option>
                <option value="conMaterias">Con materias asignadas</option>
                <option value="sinMaterias">Sin materias (Pendientes)</option>
              </select>
            </>
          )}

          {onNavigateToSubjects && (
            <button
              type="button"
              onClick={onNavigateToSubjects}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>Ver Materias</span>
            </button>
          )}

          {onNavigateToCourses && (
            <button
              type="button"
              onClick={onNavigateToCourses}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
              <span>Ver Cursos</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: BY TEACHER (CARDS) */}
      {viewMode === 'byTeacher' && (
        <div className="space-y-4">
          {filteredTeachers.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">
                No se encontraron profesores con los filtros aplicados.
              </p>
              <p className="mt-1">Prueba cambiando los términos de búsqueda o filtros.</p>
            </div>
          ) : (
            filteredTeachers.map((teacher) => {
              const teacherSubjects = getTeacherSubjects(teacher);
              const teacherCourses = courses.filter((c) => teacher.courseIds?.includes(c.id));
              const studentCount = getTeacherStudentCount(teacher);

              return (
                <div
                  key={teacher.id}
                  id={`teacher-org-card-${teacher.id}`}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all space-y-4"
                >
                  {/* Card Header: Teacher info + Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {teacher.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">{teacher.fullName}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              teacher.status === 'Activo'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {teacher.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                            <IdCard className="w-3.5 h-3.5 text-slate-400" />
                            <span>Cédula: <strong>{teacher.cedula}</strong></span>
                          </span>

                          <span className="flex items-center gap-1 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{teacher.email}</span>
                          </span>

                          {teacher.phone && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{teacher.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                      <button
                        type="button"
                        onClick={() => handleOpenManageAssignments(teacher)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        title="Asignar o desasignar cursos y materias"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Gestionar Asignaciones</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAccessDetailTeacher(teacher)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        title="Ver credenciales de acceso y permisos del portal docente"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Accesos y Credenciales</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditTeacher(teacher)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                        title="Editar datos del docente"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Two-column overview: Assigned Courses vs Assigned Subjects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Assigned Courses Column */}
                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-blue-700" />
                          <span>Cursos / Programas con Acceso ({teacherCourses.length})</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {studentCount} estudiantes en sus cursos
                        </span>
                      </div>

                      {teacherCourses.length === 0 ? (
                        <div className="py-3 text-center text-slate-400 text-xs">
                          <span className="text-amber-700 font-medium">⚠️ No tiene cursos vinculados actualmente.</span>
                          <button
                            type="button"
                            onClick={() => handleOpenManageAssignments(teacher)}
                            className="block mx-auto mt-1 text-[11px] text-blue-700 hover:underline font-semibold cursor-pointer"
                          >
                            + Vincular cursos ahora
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {teacherCourses.map((c) => (
                            <span
                              key={c.id}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-blue-200 text-blue-900 shadow-2xs flex items-center gap-1.5"
                            >
                              <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-50 px-1 py-0.5 rounded">
                                {c.code}
                              </span>
                              <span>{c.name}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assigned Subjects Column */}
                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-purple-700" />
                          <span>Materias Asignadas ({teacherSubjects.length})</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {teacherSubjects.reduce((acc, s) => acc + (s.credits || 0), 0)} créditos totales
                        </span>
                      </div>

                      {teacherSubjects.length === 0 ? (
                        <div className="py-3 text-center text-slate-400 text-xs">
                          <span className="text-amber-700 font-medium">⚠️ Sin materias a cargo en este periodo.</span>
                          <button
                            type="button"
                            onClick={() => handleOpenManageAssignments(teacher)}
                            className="block mx-auto mt-1 text-[11px] text-purple-700 hover:underline font-semibold cursor-pointer"
                          >
                            + Asignar materias a este docente
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5 pt-1">
                          {teacherSubjects.map((sub) => (
                            <div
                              key={sub.id}
                              className="p-2 rounded-lg bg-white border border-purple-200 text-xs flex items-center justify-between shadow-2xs"
                            >
                              <div className="min-w-0 pr-2">
                                <div className="font-bold text-slate-900 truncate">{sub.name}</div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                  <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1 rounded">
                                    {sub.code}
                                  </span>
                                  <span>{sub.courseName || 'Curso general'}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-right shrink-0">
                                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                  {sub.credits} créditos
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {sub.weeklyHours || 4}h/sem
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Access Privileges Summary Badge */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-700">Privilegios activos en portal:</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        ✓ Planilla de Notas (Cortes 1, 2, 3)
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                        ✓ Creación de Actividades y Exámenes
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                        ✓ Calificación y Retroalimentación
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                        ✓ Directorio de Alumnos
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAccessDetailTeacher(teacher)}
                      className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver credenciales y accesos completos</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: BY COURSE CURRICULAR MATRIX */}
      {viewMode === 'byCourse' && (
        <div className="space-y-6">
          {courses.map((course) => {
            const courseSubs = subjects.filter(
              (s) =>
                s.courseId === course.id ||
                (s.courseName && s.courseName.toLowerCase() === course.name.toLowerCase())
            );
            const courseTeachers = teachers.filter((t) => t.courseIds?.includes(course.id));
            const enrolledStudents = students.filter(
              (st) => st.courseId === course.id || (st.courseIds && st.courseIds.includes(course.id))
            );

            return (
              <div
                key={course.id}
                id={`matrix-course-${course.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
              >
                {/* Course Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <h3 className="font-bold text-base text-slate-900">{course.name}</h3>
                      </div>
                      <span className="text-xs text-slate-500">
                        {courseSubs.length} materias | {enrolledStudents.length} estudiantes matriculados | {courseTeachers.length} profesores vinculados
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subjects Table with direct Teacher selector */}
                {courseSubs.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No hay materias registradas en este curso todavía.{' '}
                    {onNavigateToSubjects && (
                      <button
                        type="button"
                        onClick={onNavigateToSubjects}
                        className="text-blue-700 hover:underline font-semibold"
                      >
                        Crear una materia
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500">
                          <th className="py-2.5 px-3 font-semibold">Código</th>
                          <th className="py-2.5 px-3 font-semibold">Materia / Asignatura</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Créditos</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Horas/Sem</th>
                          <th className="py-2.5 px-3 font-semibold">Docente Titular Asignado</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Estado Acceso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {courseSubs.map((sub) => {
                          // Find matched teacher
                          const matchedTeacher = teachers.find(
                            (t) =>
                              t.id === sub.professorId ||
                              t.cedula === sub.professorCedula ||
                              t.fullName.toLowerCase() === (sub.professor || '').toLowerCase()
                          );

                          return (
                            <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono font-medium text-slate-800">
                                {sub.code}
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900">{sub.name}</div>
                              </td>

                              <td className="py-3 px-3 text-center font-semibold text-slate-700">
                                {sub.credits}
                              </td>

                              <td className="py-3 px-3 text-center text-slate-500">
                                {sub.weeklyHours || 4}h
                              </td>

                              {/* Interactive Teacher Selector */}
                              <td className="py-3 px-3 min-w-[260px]">
                                <div className="flex items-center gap-2">
                                  <select
                                    aria-label={`Asignar profesor a ${sub.name}`}
                                    value={matchedTeacher ? matchedTeacher.id : 'none'}
                                    onChange={(e) => handleQuickReassignSubject(sub, e.target.value)}
                                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-700 ${
                                      matchedTeacher
                                        ? 'bg-white border-slate-300 text-slate-900'
                                        : 'bg-amber-50 border-amber-300 text-amber-900'
                                    }`}
                                  >
                                    <option value="none">-- Sin profesor asignado --</option>
                                    {teachers.map((t) => (
                                      <option key={t.id} value={t.id}>
                                        {t.fullName} (C.I. {t.cedula}) {t.status === 'Inactivo' ? '[Inactivo]' : ''}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </td>

                              {/* Access status badge */}
                              <td className="py-3 px-3 text-right">
                                {matchedTeacher ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <Check className="w-3 h-3" />
                                    <span>Habilitado</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Por asignar</span>
                                  </span>
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
            );
          })}
        </div>
      )}

      {/* MODAL 1: MANAGE ASSIGNMENTS (COURSES & SUBJECTS) */}
      {managingTeacher && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Gestionar Asignaciones de Docente
                  </h3>
                  <span className="text-xs text-slate-500">
                    {managingTeacher.fullName} • C.I. {managingTeacher.cedula}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setManagingTeacher(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Assign Courses */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                1. Cursos con Acceso en el Portal:
              </label>
              <p className="text-xs text-slate-500">
                El docente podrá ver estos programas y los estudiantes inscritos en ellos.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {courses.map((course) => {
                  const isChecked = selectedCoursesForTeacher.includes(course.id);
                  return (
                    <label
                      key={course.id}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedCoursesForTeacher(
                              selectedCoursesForTeacher.filter((id) => id !== course.id)
                            );
                          } else {
                            setSelectedCoursesForTeacher([...selectedCoursesForTeacher, course.id]);
                          }
                        }}
                        className="rounded text-blue-700 focus:ring-blue-600 w-4 h-4"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{course.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{course.code}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Assign Specific Subjects */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                2. Materias a Cargo de este Docente:
              </label>
              <p className="text-xs text-slate-500">
                Al seleccionar una materia, este docente será asignado como su titular, permitiéndole calificar cortes 1, 2, 3 y publicar tareas/evaluaciones.
              </p>

              <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
                {subjects.map((sub) => {
                  const isChecked = selectedSubjectsForTeacher.includes(sub.id);
                  const isAssignedToOther =
                    sub.professor &&
                    sub.professor !== 'Docente por asignar' &&
                    sub.professor !== managingTeacher.fullName &&
                    sub.professorId !== managingTeacher.id;

                  return (
                    <label
                      key={sub.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-purple-50/80 border-purple-300 text-purple-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedSubjectsForTeacher(
                                selectedSubjectsForTeacher.filter((id) => id !== sub.id)
                              );
                            } else {
                              setSelectedSubjectsForTeacher([...selectedSubjectsForTeacher, sub.id]);
                              // Also auto-select the course if not present
                              if (sub.courseId && !selectedCoursesForTeacher.includes(sub.courseId)) {
                                setSelectedCoursesForTeacher([...selectedCoursesForTeacher, sub.courseId]);
                              }
                            }
                          }}
                          className="rounded text-purple-700 focus:ring-purple-600 w-4 h-4"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{sub.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span className="font-mono text-[10px] bg-white px-1 border border-slate-200 rounded">
                              {sub.code}
                            </span>
                            <span>{sub.courseName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-semibold text-slate-600">
                          {sub.credits} créditos
                        </span>
                        {isAssignedToOther && (
                          <div className="text-[10px] text-amber-700 font-medium">
                            Dictada por: {sub.professor}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setManagingTeacher(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAssignments}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Asignaciones</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL ACCESS & CREDENTIAL SHEET */}
      {accessDetailTeacher && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Ficha de Accesos y Permisos Docentes
                  </h3>
                  <span className="text-xs text-slate-500">
                    Niveles de autorización en la plataforma
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAccessDetailTeacher(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Teacher Details */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Docente:</span>
                <span className="font-bold text-slate-900">{accessDetailTeacher.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cédula / Documento:</span>
                <span className="font-mono font-semibold text-slate-800">{accessDetailTeacher.cedula}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Correo Institucional:</span>
                <span className="text-slate-800">{accessDetailTeacher.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estado:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    accessDetailTeacher.status === 'Activo'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {accessDetailTeacher.status}
                </span>
              </div>
            </div>

            {/* Portal Credentials with Copy */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-700" />
                  <span>Credenciales para Iniciar Sesión</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `Docente: ${accessDetailTeacher.fullName}\nUsuario: ${accessDetailTeacher.cedula}\nClave: ${
                        accessDetailTeacher.initialPassword || `doc-${accessDetailTeacher.cedula}`
                      }`,
                      'cred'
                    )
                  }
                  className="text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNote === 'cred' ? '¡Copiado!' : 'Copiar Credenciales'}</span>
                </button>
              </div>

              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 font-mono space-y-1 text-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Usuario (C.I.):</span>
                  <span className="font-bold">{accessDetailTeacher.cedula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Contraseña:</span>
                  <span className="font-bold text-amber-900">
                    {accessDetailTeacher.initialPassword || `doc-${accessDetailTeacher.cedula}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Access Rights List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Módulos Habilitados en el Portal Docente:
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Planilla Oficial de Calificaciones</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ingreso de notas para Corte 1 (30%), Corte 2 (30%), Corte 3 (40%) y cálculo automático de nota definitiva aprobatoria en tiempo real.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Gestor de Actividades y Evaluaciones</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Creación, edición y ordenamiento de Tareas, Talleres, Evaluaciones tipo test con formulario interactivo y Lecturas formativas.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Revisión de Entregas de Estudiantes</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Visualización de entregas, respuestas de exámenes automatizados y envío de retroalimentaciones personalizadas.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Directorio de Estudiantes Matriculados</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Acceso al listado de alumnos matriculados en sus cursos para comunicación académica y seguimiento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAccessDetailTeacher(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Entendido / Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT TEACHER DATA */}
      {editingTeacher && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-700" />
                <h3 className="font-bold text-base text-slate-900">
                  Editar Datos del Docente
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTeacher} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Cédula / Documento de Identidad *
                </label>
                <input
                  type="text"
                  required
                  value={editCedula}
                  onChange={(e) => setEditCedula(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Teléfono Móvil
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Contraseña de Acceso al Portal
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Estado Académico
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700 cursor-pointer"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
