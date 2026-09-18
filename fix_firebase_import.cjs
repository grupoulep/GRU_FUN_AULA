const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');
code = code.replace('../firebase-applet-config.json', '../../firebase-applet-config.json');
fs.writeFileSync('src/lib/firebase.ts', code);
