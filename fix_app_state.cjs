const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/INITIAL_BANNERS \} from '\.\/data\/initialAcademicData';/, "INITIAL_BANNERS, INITIAL_CENTRAL_ANNOUNCEMENT } from './data/initialAcademicData';\nimport { CentralAnnouncement } from './types';");

code = code.replace(/const \[banners, setBanners\] = useState<Banner\[\]>\(INITIAL_BANNERS\);/, "const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);\n  const [centralAnnouncement, setCentralAnnouncement] = useState<CentralAnnouncement>(INITIAL_CENTRAL_ANNOUNCEMENT);");

fs.writeFileSync('src/App.tsx', code);
