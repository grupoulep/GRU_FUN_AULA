const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/import \{ Megaphone \} from 'lucide-react';/, `import { Megaphone, Airplay } from 'lucide-react';`);
code = code.replace(/import \{ CentralAnnouncementSection \} from '\.\/CentralAnnouncementSection';/, `import { CentralAnnouncementSection } from './CentralAnnouncementSection';\nimport { MainAdsSection } from './MainAdsSection';`);

code = code.replace(/onBannersChange\?: \(banners: Banner\[\]\) => void;/, `onBannersChange?: (banners: Banner[]) => void;\n  mainAds?: Banner[];\n  onMainAdsChange?: (ads: Banner[]) => void;`);

code = code.replace(/onBannersChange,/, `onBannersChange,\n  mainAds,\n  onMainAdsChange,`);

code = code.replace(/\{ id: 'anuncio', label: 'Anuncio Central', icon: Megaphone \}/, `{ id: 'anuncio', label: 'Anuncio Central', icon: Megaphone }, { id: 'publicidad-principal', label: 'Publicidad Principal', icon: Airplay, count: mainAds?.length || 0 }`);

const mainAdRender = `          {activeSection === 'publicidad-principal' && (
            <MainAdsSection
              mainAds={mainAds || []}
              onMainAdsChange={onMainAdsChange || (() => {})}
            />
          )}`;

code = code.replace(/\{activeSection === 'anuncio' && centralAnnouncement && onCentralAnnouncementChange && \(/, `${mainAdRender}\n          {activeSection === 'anuncio' && centralAnnouncement && onCentralAnnouncementChange && (`);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
