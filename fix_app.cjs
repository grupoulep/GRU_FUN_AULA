const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const \[banners, setBanners\] = useState<Banner\[\]>\(INITIAL_BANNERS\);/, `const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);\n  const [mainAds, setMainAds] = useState<Banner[]>([]);`);

code = code.replace(/banners=\{banners\}/g, `banners={banners}\n        mainAds={mainAds}`);
code = code.replace(/onBannersChange=\{setBanners\}/g, `onBannersChange={setBanners}\n        onMainAdsChange={setMainAds}`);

fs.writeFileSync('src/App.tsx', code);
