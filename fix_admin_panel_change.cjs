const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  `onBannersChange={onBannersChange}`,
  ``
);

code = code.replace(
  `onAdsChange={onMainAdsChange}`,
  ``
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
