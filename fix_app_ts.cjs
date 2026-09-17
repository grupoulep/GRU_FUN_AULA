const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newHandler = `
  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  };
`;
code = code.replace(/const handleDeleteCourse = \(id: string\) => \{[\s\S]+?\};/, `const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };${newHandler}`);

code = code.replace(/onDeleteCourse=\{handleDeleteCourse\}/g, `onDeleteCourse={handleDeleteCourse}\n            onUpdateCourse={handleUpdateCourse}`);

fs.writeFileSync('src/App.tsx', code);
