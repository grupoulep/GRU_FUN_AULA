const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherPortal.tsx', 'utf8');

code = code.replace(
  /<div className="flex items-center gap-3">\s*<div className="hidden sm:flex flex-col text-right">/,
  `<div className="flex items-center gap-3">
          <GlobalStudentSearch students={students} />
          <div className="h-7 w-px bg-slate-200 hidden sm:block" />
          <div className="hidden sm:flex flex-col text-right">`
);

fs.writeFileSync('src/components/TeacherPortal.tsx', code);
