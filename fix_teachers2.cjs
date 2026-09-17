const fs = require('fs');
let code = fs.readFileSync('src/components/TeachersSection.tsx', 'utf8');

code = code.replace(/registrationType: formMode === 'registro' \? registrationType : 'Admisión',/g, '');
code = code.replace(/const matchesType = typeFilter === 'todos' \|\| s\.registrationType === typeFilter;/g, 'const matchesType = true;');

// Remove the whole Registration Type dropdown block
code = code.replace(/\{\/\* Registration Type \*\/\}.*?<\/div>/gs, ''); // This might be too greedy, let's just do it manually via sed
fs.writeFileSync('src/components/TeachersSection.tsx', code);
