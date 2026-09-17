const fs = require('fs');
let code = fs.readFileSync('src/components/CoursesSection.tsx', 'utf8');

code = code.replace(/import \{ Course \} from '\.\.\/types';/, `import { Course } from '../types';\nimport { Edit2, Save, X } from 'lucide-react';`);
code = code.replace(/onDeleteCourse: \(id: string\) => void;/, `onDeleteCourse: (id: string) => void;\n  onUpdateCourse?: (course: Course) => void;`);
code = code.replace(/onDeleteCourse\n\}\) => \{/, `onDeleteCourse,\n  onUpdateCourse\n}) => {`);

const newStates = `  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');

  const handleStartEdit = (course: Course) => {
    setEditingId(course.id);
    setEditName(course.name);
    setEditCode(course.code);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim() && editCode.trim() && onUpdateCourse) {
      onUpdateCourse({ id: editingId, name: editName.trim(), code: editCode.trim().toUpperCase() });
      setEditingId(null);
      setSuccessMessage('¡Curso actualizado exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };
`;

code = code.replace(/const \[successMessage, setSuccessMessage\] = useState\(''\);/, `const [successMessage, setSuccessMessage] = useState('');\n${newStates}`);

const replacementJSX = `
            {filteredCourses.map((course) => {
              if (editingId === course.id) {
                return (
                  <div key={course.id} className="p-4 rounded-xl border border-blue-200 bg-blue-50 transition-all flex flex-col gap-3">
                    <input type="text" value={editCode} onChange={e => setEditCode(e.target.value)} placeholder="Código" className="w-full px-2 py-1 text-xs border rounded uppercase font-mono" />
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nombre del curso" className="w-full px-2 py-1 text-xs border rounded" />
                    <div className="flex justify-end gap-2 mt-2">
                      <button type="button" onClick={() => setEditingId(null)} className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded">
                        <X className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={handleSaveEdit} className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded">
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }
              return (
              <div
                key={course.id}
                id={\`course-card-\${course.id}\`}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-gradient-to-r from-blue-700 to-teal-500 text-white">
                      {course.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Código de búsqueda
                    </span>
                  </div>
                  <h4
                    className="font-semibold text-slate-900 text-sm truncate"
                    title={course.name}
                  >
                    {course.name}
                  </h4>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(course)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Editar curso"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    id={\`btn-delete-course-\${course.id}\`}
                    type="button"
                    onClick={() => onDeleteCourse(course.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Eliminar curso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
            })}
`;

code = code.replace(/\{filteredCourses\.map\(\(course\) => \([\s\S]+?\}\)\)/, replacementJSX);

fs.writeFileSync('src/components/CoursesSection.tsx', code);
