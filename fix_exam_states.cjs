const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherActivitiesManager.tsx', 'utf8');
code = code.replace(/const \[newDragDropPairs, setNewDragDropPairs\] = useState<DragDropMatch\[\]>\(\[\{item: '', match: ''\}\]\);/g, `const [newDragDropPairs, setNewDragDropPairs] = useState<DragDropMatch[]>([{item: '', match: ''}]);\n  const [examTimeLimitMinutes, setExamTimeLimitMinutes] = useState(60);\n  const [examMaxAttempts, setExamMaxAttempts] = useState(1);`);
fs.writeFileSync('src/components/TeacherActivitiesManager.tsx', code);
