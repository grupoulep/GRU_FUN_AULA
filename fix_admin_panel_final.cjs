const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/import \{ Course, Subject, StudentAdmission, AdminSection, Activity, Banner \} from '\.\.\/types';/, `import { Course, Subject, StudentAdmission, AdminSection, Activity, Banner, CentralAnnouncement } from '../types';\nimport { Megaphone } from 'lucide-react';`);

code = code.replace(/import \{ BannersSection \} from '\.\/BannersSection';/, `import { BannersSection } from './BannersSection';\nimport { CentralAnnouncementSection } from './CentralAnnouncementSection';`);

code = code.replace(/onBannersChange\?: \(banners: Banner\[\]\) => void;/, `onBannersChange?: (banners: Banner[]) => void;\n  centralAnnouncement?: CentralAnnouncement;\n  onCentralAnnouncementChange?: (announcement: CentralAnnouncement) => void;`);

code = code.replace(/onBannersChange,/, `onBannersChange,\n  centralAnnouncement,\n  onCentralAnnouncementChange,`);

code = code.replace(/\{ id: 'banners', label: 'Banners Publicitarios', icon: ImageIcon, count: banners\?\.length \|\| 0 \}/, `{ id: 'banners', label: 'Banners Publicitarios', icon: ImageIcon, count: banners?.length || 0 }, { id: 'anuncio', label: 'Anuncio Central', icon: Megaphone }`);

const renderString = `          {activeSection === 'anuncio' && centralAnnouncement && onCentralAnnouncementChange && (
            <CentralAnnouncementSection
              announcement={centralAnnouncement}
              onUpdateAnnouncement={onCentralAnnouncementChange}
            />
          )}`;
code = code.replace(/<BannersSection\s+banners=\{banners \|\| \[\]\}\s+onBannersChange=\{onBannersChange \|\| \(\(\) => \{\}\)\}\s+\/>\s+\)\}/, `<BannersSection
              banners={banners || []}
              onBannersChange={onBannersChange || (() => {})}
            />
          )}
${renderString}`);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
