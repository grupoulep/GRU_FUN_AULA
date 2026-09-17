const fs = require('fs');

let code = fs.readFileSync('src/components/BannersSection.tsx', 'utf8');

// Replace component name
code = code.replace(/BannersSection/g, 'MainAdsSection');
// Replace props
code = code.replace(/banners/g, 'mainAds');
code = code.replace(/onBannersChange/g, 'onMainAdsChange');
code = code.replace(/Banner/g, 'Banner'); // no change, just in case
code = code.replace(/newBanner/g, 'newMainAd');
code = code.replace(/Gestión de Banners Publicitarios/g, 'Gestión de Publicidad Principal');
code = code.replace(/Agrega y edita los banners que se mostrarán en el carrusel del portal del estudiante\./g, 'Agrega y edita la publicidad principal que aparecerá a pantalla completa cuando el estudiante inicie sesión. (Deben ver todas para continuar).');
code = code.replace(/Nuevo Banner/g, 'Nueva Publicidad');
code = code.replace(/Agregar Nuevo Banner/g, 'Agregar Nueva Publicidad');
code = code.replace(/Guardar Banner/g, 'Guardar Publicidad');
code = code.replace(/No hay banners publicados/g, 'No hay publicidad principal publicada');
code = code.replace(/Comienza agregando tu primer banner promocional haciendo clic en "Nuevo Banner"\./g, 'Comienza agregando tu primera publicidad a pantalla completa haciendo clic en "Nueva Publicidad".');

fs.writeFileSync('src/components/MainAdsSection.tsx', code);
