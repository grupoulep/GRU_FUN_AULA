import React from 'react';
import { Course, Subject, StudentAdmission, Teacher, AdminSection } from '../types';
import { GraduationCap, BookOpen, UserCheck, ArrowRight, Building, CheckCircle2, Users, ShieldCheck } from 'lucide-react';

interface DashboardOverviewProps {
  courses: Course[];
  subjects: Subject[];
  students: StudentAdmission[];
  teachers?: Teacher[];
  onNavigate: (section: AdminSection) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  courses,
  subjects,
  students,
  teachers = [],
  onNavigate
}) => {
  const teachersWithSubjects = teachers.filter((t) =>
    subjects.some(
      (s) =>
        s.professorId === t.id ||
        s.professorCedula === t.cedula ||
        (s.professor && t.fullName && s.professor.toLowerCase().includes(t.fullName.toLowerCase()))
    )
  ).length;

  return (
    <div id="dashboard-overview" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-teal-500 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Panel Administrativo
            </span>
            <h2 id="dashboard-heading" className="text-xl font-bold text-white tracking-tight mt-2">
              Gestión Integral de la Institución
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Supervisión de oferta académica, asignación de docentes por materia y accesos al portal en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-medium text-slate-200 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Periodo Lectivo 2026-I
            </span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards linking to core sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Crear Cursos */}
        <div
          id="stat-card-courses"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{courses.length}</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Cursos y Técnicos</h3>
            <p className="text-xs text-slate-500 mt-1">
              {courses.length} programas formativos (Cursos y Técnicos) con materias integradas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer w-full text-left"
          >
            <span>Ir a Crear Curso o Técnico</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Agregar Materias */}
        <div
          id="stat-card-subjects"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{subjects.length}</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Materias / Asignaturas</h3>
            <p className="text-xs text-slate-500 mt-1">
              Asignadas a los programas curriculares activos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('subjects')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer w-full text-left"
          >
            <span>Ver Materias por Curso o Técnico</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Organización Docente */}
        <div
          id="stat-card-teacher-org"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-purple-950">{teachers.length}</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Organización Docente</h3>
            <p className="text-xs text-slate-500 mt-1">
              {teachersWithSubjects} docentes con materias asignadas y accesos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('teacher-organization')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700 hover:text-purple-800 transition-colors cursor-pointer w-full text-left"
          >
            <span>Cursos y Materias por Docente</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Admitir Estudiantes */}
        <div
          id="stat-card-admissions"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{students.length}</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Estudiantes</h3>
            <p className="text-xs text-slate-500 mt-1">
              {students.filter((s) => s.status === 'Matriculado').length} matriculados formalmente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('admissions')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer w-full text-left"
          >
            <span>Ir a Registrar Usuarios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Institutional Activity Table Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">Admisiones Recientes</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Últimos registros
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('admissions')}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            Ver todos los estudiantes
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                <th className="py-2.5 px-3 font-semibold">Cédula</th>
                <th className="py-2.5 px-3 font-semibold">Estudiante</th>
                <th className="py-2.5 px-3 font-semibold">Curso Asignado</th>
                <th className="py-2.5 px-3 font-semibold">Fecha</th>
                <th className="py-2.5 px-3 font-semibold text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.slice(0, 5).map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{std.cedula}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{std.fullName}</td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[200px]">{std.courseName}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{std.admissionDate}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        std.status === 'Matriculado'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : std.status === 'Admitido'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {std.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
