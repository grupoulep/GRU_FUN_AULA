const fs = require('fs');
let code = fs.readFileSync('src/components/SubjectsSection.tsx', 'utf8');

code = code.replace(/import \{ Subject, Course \} from '\.\.\/types';/, `import { Subject, Course } from '../types';\nimport { Edit2, Save, X } from 'lucide-react';`);
code = code.replace(/onDeleteSubject: \(id: string\) => void;/, `onDeleteSubject: (id: string) => void;\n  onUpdateSubject?: (subject: Subject) => void;`);
code = code.replace(/onDeleteSubject\n\}\) => \{/, `onDeleteSubject,\n  onUpdateSubject\n}) => {`);

const newStates = `  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editCredits, setEditCredits] = useState(4);
  const [editCourseId, setEditCourseId] = useState('');
  const [editProfessor, setEditProfessor] = useState('');
  const [editWeeklyHours, setEditWeeklyHours] = useState(4);

  const handleStartEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setEditName(subject.name);
    setEditCode(subject.code);
    setEditCredits(subject.credits);
    setEditCourseId(subject.courseId || '');
    setEditProfessor(subject.professor || '');
    setEditWeeklyHours(subject.weeklyHours);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim() && editCode.trim() && onUpdateSubject) {
      const matchedCourse = courses.find((c) => c.id === editCourseId);
      const courseName = matchedCourse ? matchedCourse.name : 'General';
      onUpdateSubject({
        id: editingId,
        name: editName.trim(),
        code: editCode.trim().toUpperCase(),
        credits: editCredits,
        courseId: editCourseId,
        courseName,
        professor: editProfessor,
        weeklyHours: editWeeklyHours
      });
      setEditingId(null);
      setSuccessMessage('¡Materia actualizada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };
`;

code = code.replace(/const \[successMessage, setSuccessMessage\] = useState\(''\);/, `const [successMessage, setSuccessMessage] = useState('');\n${newStates}`);

const replacementJSX = `
                {filteredSubjects.map((subject) => {
                  if (editingId === subject.id) {
                    return (
                      <tr key={subject.id} className="bg-blue-50/50">
                        <td className="py-2 px-2"><input type="text" value={editCode} onChange={e => setEditCode(e.target.value)} className="w-full text-xs px-2 py-1 border rounded" /></td>
                        <td className="py-2 px-2"><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full text-xs px-2 py-1 border rounded" /></td>
                        <td className="py-2 px-2">
                          <select value={editCourseId} onChange={e => setEditCourseId(e.target.value)} className="w-full text-xs px-2 py-1 border rounded">
                            <option value="">-- Seleccionar --</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-2"><input type="text" value={editProfessor} onChange={e => setEditProfessor(e.target.value)} className="w-full text-xs px-2 py-1 border rounded" /></td>
                        <td className="py-2 px-2"><input type="number" value={editCredits} onChange={e => setEditCredits(Number(e.target.value))} className="w-full text-xs px-2 py-1 border rounded text-center" /></td>
                        <td className="py-2 px-2"><input type="number" value={editWeeklyHours} onChange={e => setEditWeeklyHours(Number(e.target.value))} className="w-full text-xs px-2 py-1 border rounded text-center" /></td>
                        <td className="py-2 px-2 text-right">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => setEditingId(null)} className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded">
                              <X className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={handleSaveEdit} className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-200 rounded">
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return (
                  <tr key={subject.id} id={\`subject-row-\${subject.id}\`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      {subject.code}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {subject.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="inline-block max-w-[200px] truncate" title={subject.courseName}>
                        {subject.courseName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{subject.professor}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {subject.credits} CR
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {subject.weeklyHours}h
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(subject)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Editar materia"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={\`btn-delete-subject-\${subject.id}\`}
                          type="button"
                          onClick={() => onDeleteSubject(subject.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar materia"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
`;

code = code.replace(/\{filteredSubjects\.map\(\(subject\) => \([\s\S]+?\}\)\)/, replacementJSX);

fs.writeFileSync('src/components/SubjectsSection.tsx', code);
