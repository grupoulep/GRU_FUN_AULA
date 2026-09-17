const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

const regex = /\{\/\* Main Ads Modal \*\/\}[\s\S]*?\{\/\* Top Navigation \*\/\}/;

const newHTML = `{/* Main Ads Modal */}
      {showMainAds && activeMainAds.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-[360px] h-[640px] max-h-[90vh] bg-black rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 ring-4 ring-white/10">
            
            {/* Fake X button that does not close */}
            <button
              onClick={(e) => {
                e.preventDefault();
                alert("Por favor visualiza la publicidad para continuar.");
              }}
              className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
              title="Cerrar"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {/* Ad Image */}
            <div className="flex-1 relative w-full h-full">
               <img 
                 src={activeMainAds[currentAdIndex].imageUrl} 
                 alt={activeMainAds[currentAdIndex].title || 'Publicidad'} 
                 className="absolute inset-0 w-full h-full object-cover" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {activeMainAds.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={\`h-1.5 rounded-full transition-all \${idx === currentAdIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}\`} 
                  />
                ))}
              </div>
              
              <div className="text-center">
                <h3 className="text-white font-bold text-lg mb-2 drop-shadow-md">
                  {activeMainAds[currentAdIndex].title || 'Publicidad'}
                </h3>
              </div>

              {currentAdIndex < activeMainAds.length - 1 ? (
                <button
                  onClick={() => setCurrentAdIndex(prev => prev + 1)}
                  className="w-full py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={() => setShowMainAds(false)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  Comenzar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}`;

code = code.replace(regex, newHTML);
fs.writeFileSync('src/components/StudentPortal.tsx', code);
