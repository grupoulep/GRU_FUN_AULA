const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherPortal.tsx', 'utf8');

// Change the button onClick to also set activeTab
code = code.replace(/onClick=\{\(\) => setSelectedSubjectId\(sub\.id\)\}/, `onClick={() => { setSelectedSubjectId(sub.id); setActiveTab('activities'); }}`);

// Remove the "Editor Global de Actividades" tab button
code = code.replace(/<button\s+id="tab-activities"[\s\S]+?<\/button>/, '');

fs.writeFileSync('src/components/TeacherPortal.tsx', code);
