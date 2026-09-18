const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  `  banners?: Banner[];\n  onBannersChange?: (banners: Banner[]) => void;`,
  `  banners?: Banner[];\n  onAddBanner?: (banner: Omit<Banner, 'id'>) => void;\n  onUpdateBanner?: (banner: Banner) => void;\n  onDeleteBanner?: (id: string) => void;`
);

code = code.replace(
  `  mainAds?: Banner[];\n  onMainAdsChange?: (ads: Banner[]) => void;`,
  `  mainAds?: Banner[];\n  onAddMainAd?: (ad: Omit<Banner, 'id'>) => void;\n  onUpdateMainAd?: (ad: Banner) => void;\n  onDeleteMainAd?: (id: string) => void;`
);

code = code.replace(
  `  banners,\n  onBannersChange,\n  mainAds,\n  onMainAdsChange,`,
  `  banners,\n  onAddBanner,\n  onUpdateBanner,\n  onDeleteBanner,\n  mainAds,\n  onAddMainAd,\n  onUpdateMainAd,\n  onDeleteMainAd,`
);

code = code.replace(
  `<BannersSection banners={banners || []} onBannersChange={onBannersChange || (() => {})} />`,
  `<BannersSection banners={banners || []} onAddBanner={onAddBanner} onUpdateBanner={onUpdateBanner} onDeleteBanner={onDeleteBanner} />`
);

code = code.replace(
  `<MainAdsSection ads={mainAds || []} onAdsChange={onMainAdsChange || (() => {})} />`,
  `<MainAdsSection ads={mainAds || []} onAddAd={onAddMainAd} onUpdateAd={onUpdateMainAd} onDeleteAd={onDeleteMainAd} />`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
