const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/export type AdminSection = 'dashboard' \| 'courses' \| 'subjects' \| 'admissions' \| 'banners' \| 'anuncio';/, `export type AdminSection = 'dashboard' | 'courses' | 'subjects' | 'admissions' | 'banners' | 'publicidad-principal' | 'anuncio';`);

fs.writeFileSync('src/types.ts', code);
