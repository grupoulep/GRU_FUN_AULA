const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const navBanners = `{
      id: 'banners',
      label: 'Banners Publicitarios',
      icon: ImageIcon,
      count: banners?.length || 0
    }`;

const newNavItems = `{
      id: 'banners',
      label: 'Banners Publicitarios',
      icon: ImageIcon,
      count: banners?.length || 0
    },
    {
      id: 'publicidad-principal',
      label: 'Publicidad Principal',
      icon: Airplay,
      count: mainAds?.length || 0
    }`;

code = code.replace(navBanners, newNavItems);

// Make sure AdminSection type includes it
code = code.replace(/export type AdminSection = [\s\S]+?;/, `export type AdminSection = 'dashboard' | 'courses' | 'subjects' | 'admissions' | 'banners' | 'publicidad-principal' | 'anuncio';`);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
