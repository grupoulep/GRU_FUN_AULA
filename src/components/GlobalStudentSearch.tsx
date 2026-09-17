import React, { useState, useRef, useEffect } from 'react';
import { Search, IdCard, Mail, Phone, BookOpen, Calendar, X, UserCheck, Key } from 'lucide-react';
import { StudentAdmission } from '../types';

interface GlobalStudentSearchProps {
  students: StudentAdmission[];
}

export const GlobalStudentSearch: React.FC<GlobalStudentSearchProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentAdmission | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStudents = searchTerm.trim() === '' ? [] : students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cedula.includes(searchTerm) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative w-48 sm:w-64 lg:w-80">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar estudiante..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchTerm.trim() !== '') setIsOpen(true);
          }}
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && searchTerm.trim() !== '' && (
        <div className="absolute top-full right-0 mt-2 w-[350px] sm:w-[450px] max-w-[90vw] bg-white border border-slate-200 rounded-xl shadow-xl z-[60] max-h-[80vh] overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              No se encontraron estudiantes que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
                Resultados de Búsqueda ({filteredStudents.length})
              </div>
              {filteredStudents.map(student => (
                <div 
                  key={student.id} 
                  className="p-4 border-b border-slate-100 hover:bg-slate-50 last:border-0 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedStudent(student);
                    setIsOpen(false);
                  }}
                >
                   <div className="flex justify-between items-start mb-1">
                     <h4 className="font-bold text-blue-950 text-sm">{student.fullName}</h4>
                     <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                        student.status === 'Admitido' ? 'bg-green-100 text-green-700' :
                        student.status === 'Matriculado' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                     }`}>
                       {student.status}
                     </span>
                   </div>
                   <div className="grid grid-cols-2 gap-2 mt-2">
                     <div className="text-xs text-slate-500 flex items-center gap-1.5">
                       <IdCard className="w-3.5 h-3.5 text-slate-400" /> {student.cedula}
                     </div>
                     <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                       <Mail className="w-3.5 h-3.5 text-slate-400" /> {student.email}
                     </div>
                   </div>
                   <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5 truncate">
                     <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {student.courseName}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 text-white relative">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.fullName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 text-xs font-bold uppercase rounded-full bg-white/20">
                      {selectedStudent.status}
                    </span>
                    <span className="text-sm text-blue-200">
                      ID: {selectedStudent.cedula}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5" /> Documento (Cédula)
                  </label>
                  <p className="text-sm font-semibold text-slate-900">{selectedStudent.cedula}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Fecha de Registro
                  </label>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedStudent.admissionDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                  </label>
                  <p className="text-sm font-semibold text-slate-900">{selectedStudent.email}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Teléfono
                  </label>
                  <p className="text-sm font-semibold text-slate-900">{selectedStudent.phone || 'No registrado'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Programa / Curso Matriculado
                  </label>
                  <p className="text-sm font-semibold text-slate-900">{selectedStudent.courseName}</p>
                </div>
              </div>

              {selectedStudent.initialPassword && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" /> Contraseña Inicial (Generada)
                    </label>
                    <p className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded inline-block">
                      {selectedStudent.initialPassword}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
