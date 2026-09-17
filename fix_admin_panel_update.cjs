const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/onDeleteCourse\?: \(id: string\) => void;/, `onDeleteCourse?: (id: string) => void;\n  onUpdateCourse?: (course: Course) => void;`);
code = code.replace(/onDeleteSubject\?: \(id: string\) => void;/, `onDeleteSubject?: (id: string) => void;\n  onUpdateSubject?: (subject: Subject) => void;`);

code = code.replace(/onDeleteCourse: externalOnDeleteCourse,/, `onDeleteCourse: externalOnDeleteCourse,\n  onUpdateCourse: externalOnUpdateCourse,`);
code = code.replace(/onDeleteSubject: externalOnDeleteSubject,/, `onDeleteSubject: externalOnDeleteSubject,\n  onUpdateSubject: externalOnUpdateSubject,`);

code = code.replace(/const handleDeleteCourse = \(id: string\) => \{[\s\S]+?\};/, `const handleDeleteCourse = (id: string) => {
    if (externalOnDeleteCourse) {
      externalOnDeleteCourse(id);
    } else {
      setInternalCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleUpdateCourse = (course: Course) => {
    if (externalOnUpdateCourse) {
      externalOnUpdateCourse(course);
    } else {
      setInternalCourses((prev) =>
        prev.map((c) => (c.id === course.id ? course : c))
      );
    }
  };`);

code = code.replace(/const handleDeleteSubject = \(id: string\) => \{[\s\S]+?\};/, `const handleDeleteSubject = (id: string) => {
    if (externalOnDeleteSubject) {
      externalOnDeleteSubject(id);
    } else {
      setInternalSubjects((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleUpdateSubject = (subject: Subject) => {
    if (externalOnUpdateSubject) {
      externalOnUpdateSubject(subject);
    } else {
      setInternalSubjects((prev) =>
        prev.map((s) => (s.id === subject.id ? subject : s))
      );
    }
  };`);

code = code.replace(/<CoursesSection\s+courses=\{courses\}\s+onAddCourse=\{handleAddCourse\}\s+onDeleteCourse=\{handleDeleteCourse\}\s+\/>/, `<CoursesSection
              courses={courses}
              onAddCourse={handleAddCourse}
              onDeleteCourse={handleDeleteCourse}
              onUpdateCourse={handleUpdateCourse}
            />`);

code = code.replace(/<SubjectsSection\s+subjects=\{subjects\}\s+courses=\{courses\}\s+onAddCourse=\{handleAddSubject\}\s+onDeleteSubject=\{handleDeleteSubject\}\s+\/>/, `<SubjectsSection
              subjects={subjects}
              courses={courses}
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
              onUpdateSubject={handleUpdateSubject}
            />`);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
