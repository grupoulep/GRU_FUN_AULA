const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherActivitiesManager.tsx', 'utf8');

code = code.replace(/onUpdateSubject\?: \(subject: Subject\) => void;/, `onUpdateSubject?: (subject: Subject) => void;\n  onBack?: () => void;`);
code = code.replace(/onUpdateSubject\n\}\) => \{/, `onUpdateSubject,\n  onBack\n}) => {`);

const backButtonHTML = `      {/* Header and Subject Selector */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950 bg-white hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-all w-fit cursor-pointer border border-slate-200 shadow-xs mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Clases</span>
        </button>
      )}
      <div`;

code = code.replace(/      \{\/\* Header and Subject Selector \*\/\}\n      <div/, backButtonHTML);

fs.writeFileSync('src/components/TeacherActivitiesManager.tsx', code);
