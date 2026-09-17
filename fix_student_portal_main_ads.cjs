const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

code = code.replace(/banners\?: Banner\[\];/, `banners?: Banner[];\n  mainAds?: Banner[];`);
code = code.replace(/banners = \[\],/, `banners = [],\n  mainAds = [],`);

// Setup mainAds state
code = code.replace(/const \[showAnnouncement, setShowAnnouncement\] = useState\(centralAnnouncement\?\.active \|\| false\);/, `const [showAnnouncement, setShowAnnouncement] = useState(centralAnnouncement?.active || false);\n  const activeMainAds = mainAds.filter(ad => ad.active);\n  const [showMainAds, setShowMainAds] = useState(activeMainAds.length > 0);\n  const [currentAdIndex, setCurrentAdIndex] = useState(0);`);

const mainAdHTML = `      {/* Main Ads Modal */}
      {showMainAds && activeMainAds.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"></div>
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="w-full h-64 sm:h-96 relative bg-slate-100 flex-1">
               <img src={activeMainAds[currentAdIndex].imageUrl} alt={activeMainAds[currentAdIndex].title || 'Publicidad'} className="w-full h-full object-cover bg-black" />
            </div>
            <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-slate-600 font-medium">
                Publicidad {currentAdIndex + 1} de {activeMainAds.length}
              </div>
              {currentAdIndex < activeMainAds.length - 1 ? (
                <button
                  onClick={() => setCurrentAdIndex(prev => prev + 1)}
                  className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-colors w-full sm:w-auto"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={() => setShowMainAds(false)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors w-full sm:w-auto"
                >
                  Comenzar
                </button>
              )}
            </div>
          </div>
        </div>
      )}`;

// Insert right before Central Announcement
code = code.replace(/\{\/\* Central Announcement Modal \*\/\}/, `${mainAdHTML}\n      {/* Central Announcement Modal */}`);

// Do not show central announcement until main ads are done
code = code.replace(/showAnnouncement && centralAnnouncement/, `showAnnouncement && !showMainAds && centralAnnouncement`);

fs.writeFileSync('src/components/StudentPortal.tsx', code);
