const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  `import { Activity, Subject, Course, StudentAdmission, Banner, SideAd } from './types';\nimport { INITIAL_ACTIVITIES, INITIAL_SUBJECTS, INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_BANNERS, INITIAL_CENTRAL_ANNOUNCEMENT } from './data/initialAcademicData';\nimport { CentralAnnouncement } from './types';`,
  `import { Activity, Subject, Course, StudentAdmission, Banner, SideAd, CentralAnnouncement } from './types';\nimport { useAcademicData } from './hooks/useAcademicData';`
);
fs.writeFileSync('src/App.tsx', code);
