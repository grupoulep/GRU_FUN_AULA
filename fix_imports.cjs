const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherActivitiesManager.tsx', 'utf8');

code = code.replace(/import \{ ArrowLeft,\s+Subject, Activity/g, `import { Subject, Activity`);

fs.writeFileSync('src/components/TeacherActivitiesManager.tsx', code);
