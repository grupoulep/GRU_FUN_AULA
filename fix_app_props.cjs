const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `onCentralAnnouncementChange={setCentralAnnouncement}`,
  `onCentralAnnouncementChange={handleCentralAnnouncementChange}`
);
code = code.replace(
  `onSideAdChange={setSideAd}`,
  `onSideAdChange={handleSideAdChange}`
);
code = code.replace(
  `onBannersChange={setBanners}`,
  `onAddBanner={handleAddBanner}\n        onUpdateBanner={handleUpdateBanner}\n        onDeleteBanner={handleDeleteBanner}`
);
code = code.replace(
  `onMainAdsChange={setMainAds}`,
  `onAddMainAd={handleAddMainAd}\n        onUpdateMainAd={handleUpdateMainAd}\n        onDeleteMainAd={handleDeleteMainAd}`
);

fs.writeFileSync('src/App.tsx', code);
