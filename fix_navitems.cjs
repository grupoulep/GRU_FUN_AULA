const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
code = code.replace(/    \{\s*label: 'Panel de Cursos',\s*icon: FolderKanban,\s*count: courses\.length\s*\},/g, '');
fs.writeFileSync('src/components/AdminPanel.tsx', code);
