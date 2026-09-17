const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

code = code.replace(/const courseSubjects = selectedCourse/g, `const studentSubjects = studentCourses.flatMap(c => subjects.filter(s => s.courseId === c.id || (s.courseName && c.name && s.courseName.toLowerCase() === c.name.toLowerCase())));\n  const courseSubjects = selectedCourse`);

code = code.replace(/mySubjects/g, 'studentSubjects');

fs.writeFileSync('src/components/StudentPortal.tsx', code);
