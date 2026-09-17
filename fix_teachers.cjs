const fs = require('fs');
let code = fs.readFileSync('src/components/TeachersSection.tsx', 'utf8');

code = code.replace(/const \[courseId, setCourseId\] = useState\(courses\[0\]\?\.id \|\| ''\);/, 
  "const [courseIds, setCourseIds] = useState<string[]>([]);");

code = code.replace(/const \[status, setStatus\] = useState<Teacher\['status'\]>\('Admitido'\);/,
  "const [status, setStatus] = useState<Teacher['status']>('Activo');");

// Remove registrationType
code = code.replace(/const \[registrationType, setRegistrationType\] = useState<[\s\S]*?>\('Registro'\);/, '');
code = code.replace(/registrationType,/g, '');

code = code.replace(/const matchedCourse = courses\.find\(\(c\) => c\.id === courseId\);/g, '');
code = code.replace(/courseName: matchedCourse\?\.name \|\| 'Curso Desconocido',/g, '');

code = code.replace(/courseId: courseId \|\| \(courses\[0\]\?\.id \?\? 'default'\),/, 'courseIds,');

code = code.replace(/<option value="Admitido">Admitido<\/option>/g, '<option value="Activo">Activo</option>');
code = code.replace(/<option value="Pendiente">Pendiente<\/option>/g, '<option value="Inactivo">Inactivo</option>');
code = code.replace(/<option value="Matriculado">Matriculado<\/option>/g, '');

code = code.replace(/teacher.courseName/g, 'teacher.courseIds.map(id => courses.find(c => c.id === id)?.name || id).join(", ")');

code = code.replace(/teacher.admissionDate/g, 'teacher.registrationDate');
code = code.replace(/admissionDate/g, 'registrationDate');

// Fix course select multiple
code = code.replace(/<select\s+required\s+value=\{courseId\}\s+onChange=\{\(e\) => setCourseId\(e\.target\.value\)\}/,
  `<select
    multiple
    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px]"
    value={courseIds}
    onChange={(e) => {
      const values = Array.from(e.target.selectedOptions, option => option.value);
      setCourseIds(values);
    }}`);

fs.writeFileSync('src/components/TeachersSection.tsx', code);
