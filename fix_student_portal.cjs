const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

code = code.replace(/import \{ Subject, Activity, Course, StudentAdmission, Banner \} from '\.\.\/types';/, `import { Subject, Activity, Course, StudentAdmission, Banner, CentralAnnouncement } from '../types';\nimport { X as XIcon, Megaphone } from 'lucide-react';`);

code = code.replace(/banners\?: Banner\[\];/, `banners?: Banner[];\n  centralAnnouncement?: CentralAnnouncement;`);

code = code.replace(/banners = \[\],/, `banners = [],\n  centralAnnouncement,`);

code = code.replace(/const \[selectedSubjectId, setSelectedSubjectId\] = useState<string \| null>\(null\);/, `const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);\n  const [showAnnouncement, setShowAnnouncement] = useState(centralAnnouncement?.active || false);`);

const announcementHTML = `    <div id="student-portal-container" className="min-h-screen w-full bg-slate-50 flex flex-col text-slate-800 relative">
      {/* Central Announcement Modal */}
      {showAnnouncement && centralAnnouncement && centralAnnouncement.active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAnnouncement(false)}></div>
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-sm backdrop-blur transition-colors"
              aria-label="Cerrar anuncio"
            >
              <XIcon className="w-5 h-5" />
            </button>
            {centralAnnouncement.imageUrl && (
              <div className="w-full h-48 sm:h-64 relative bg-slate-100">
                <img src={centralAnnouncement.imageUrl} alt="Anuncio" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 sm:p-8 md:p-10 text-center">
              {!centralAnnouncement.imageUrl && (
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Megaphone className="w-8 h-8" />
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">{centralAnnouncement.title}</h2>
              <p className="text-base sm:text-lg text-slate-600 whitespace-pre-wrap leading-relaxed">{centralAnnouncement.content}</p>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="mt-8 px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Continuar a mi portal
              </button>
            </div>
          </div>
        </div>
      )}`;

code = code.replace(/<div id="student-portal-container" className="min-h-screen w-full bg-slate-50 flex flex-col text-slate-800">/, announcementHTML);

fs.writeFileSync('src/components/StudentPortal.tsx', code);
