const fs = require('fs');

const filePatterns = [
  {
    path: 'src/App.tsx',
    logoRegex: /<div[\s\S]*?id="login-icon-badge"[\s\S]*?<\/div>/,
    logoReplacement: '<img src="/logo.png" alt="Fundación ULEP" className="h-[4.5rem] w-auto mx-auto mb-6 object-contain drop-shadow-sm" />'
  },
  {
    path: 'src/components/AdminPanel.tsx',
    logoRegex: /<div id="admin-brand-badge" className="flex items-center gap-2\.5">[\s\S]*?<div className="w-9 h-9 rounded-lg bg-gradient-to-br[\s\S]*?<\/div>[\s\S]*?<div>[\s\S]*?<span className="font-semibold text-slate-900 text-base leading-none">[\s\S]*?Panel Administrativo[\s\S]*?<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>/,
    logoReplacement: `<div id="admin-brand-badge" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Fundación ULEP" className="h-8 w-auto object-contain" />
          </div>`
  },
  {
    path: 'src/components/StudentPortal.tsx',
    logoRegex: /<div className="flex items-center gap-3">\s*<div className="w-9 h-9 rounded-xl bg-gradient-to-br[\s\S]*?<\/div>\s*<div>\s*<h1 className="font-bold text-slate-900 text-lg leading-none tracking-tight">\s*Portal del Estudiante\s*<\/h1>\s*<\/div>\s*<\/div>/,
    logoReplacement: `<div className="flex items-center gap-3">
          <img src="/logo.png" alt="Fundación ULEP" className="h-9 w-auto object-contain" />
        </div>`
  },
  {
    path: 'src/components/TeacherPortal.tsx',
    logoRegex: /<div className="flex items-center gap-3">\s*<div className="w-9 h-9 rounded-lg bg-gradient-to-br[\s\S]*?<\/div>/,
    logoReplacement: `<div className="flex items-center gap-3">
          <img src="/logo.png" alt="Fundación ULEP" className="h-9 w-auto object-contain" />`
  }
];

filePatterns.forEach(({path, logoRegex, logoReplacement}) => {
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, 'utf8');

  // Replace colors
  code = code.replace(/from-blue-700 to-teal-500/g, 'from-blue-900 to-sky-400');
  
  // Replace emerald with sky (lighter blue from logo)
  code = code.replace(/emerald-500/g, 'sky-500');
  code = code.replace(/emerald-600/g, 'sky-600');
  code = code.replace(/emerald-700/g, 'sky-700');
  code = code.replace(/emerald-50/g, 'sky-50');
  code = code.replace(/emerald-100/g, 'sky-100');
  code = code.replace(/emerald-800/g, 'sky-800');
  code = code.replace(/emerald-900/g, 'sky-900');

  // Replace teal with blue (darker blue from logo)
  code = code.replace(/teal-500/g, 'blue-600');
  code = code.replace(/teal-600/g, 'blue-700');
  code = code.replace(/teal-50/g, 'blue-50');

  // Replace indigos
  code = code.replace(/indigo-500/g, 'blue-700');
  code = code.replace(/purple-600/g, 'sky-500');

  // Adjust slates for higher contrast (text & backgrounds)
  code = code.replace(/text-slate-900/g, 'text-blue-950');
  code = code.replace(/text-slate-800/g, 'text-blue-900');
  code = code.replace(/bg-slate-900/g, 'bg-blue-950');
  code = code.replace(/bg-slate-800/g, 'bg-blue-900');

  // Apply logo replacements
  code = code.replace(logoRegex, logoReplacement);

  fs.writeFileSync(path, code);
  console.log(`Updated ${path}`);
});
