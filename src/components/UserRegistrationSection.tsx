import React, { useState } from 'react';
import { Course, StudentAdmission, Teacher } from '../types';
import { StudentsSection } from './StudentsSection';
import { TeachersSection } from './TeachersSection';

interface UserRegistrationSectionProps {
  students: StudentAdmission[];
  teachers: Teacher[];
  courses: Course[];
  onAddStudent: (student: Omit<StudentAdmission, 'id' | 'admissionDate'>) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateStudentStatus: (id: string, status: StudentAdmission['status']) => void;
  onAddTeacher: (teacher: Omit<Teacher, 'id' | 'registrationDate'>) => void;
  onDeleteTeacher: (id: string) => void;
  onUpdateTeacherStatus: (id: string, status: Teacher['status']) => void;
}

export const UserRegistrationSection: React.FC<UserRegistrationSectionProps> = ({
  students,
  teachers,
  courses,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudentStatus,
  onAddTeacher,
  onDeleteTeacher,
  onUpdateTeacherStatus
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full max-w-sm">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'students' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Estudiantes
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'teachers' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Profesores
        </button>
      </div>

      <div>
        {activeTab === 'students' ? (
          <StudentsSection
            students={students}
            courses={courses}
            onAddStudent={onAddStudent}
            onDeleteStudent={onDeleteStudent}
            onUpdateStatus={onUpdateStudentStatus}
          />
        ) : (
          <TeachersSection
            teachers={teachers}
            courses={courses}
            onAddTeacher={onAddTeacher}
            onDeleteTeacher={onDeleteTeacher}
            onUpdateStatus={onUpdateTeacherStatus}
          />
        )}
      </div>
    </div>
  );
};
