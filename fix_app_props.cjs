const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<AdminPanel/, `<AdminPanel\n        centralAnnouncement={centralAnnouncement}\n        onCentralAnnouncementChange={setCentralAnnouncement}`);

code = code.replace(/<StudentPortal/, `<StudentPortal\n        centralAnnouncement={centralAnnouncement}`);

fs.writeFileSync('src/App.tsx', code);
