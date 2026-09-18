const fs = require('fs');
let code = fs.readFileSync('src/components/MainAdsSection.tsx', 'utf8');

code = code.replace(
  `interface MainAdsSectionProps {\n  ads: Banner[];\n  onAdsChange: (ads: Banner[]) => void;\n}`,
  `interface MainAdsSectionProps {\n  ads: Banner[];\n  onAddAd?: (ad: Omit<Banner, 'id'>) => void;\n  onUpdateAd?: (ad: Banner) => void;\n  onDeleteAd?: (id: string) => void;\n}`
);
code = code.replace(
  `export const MainAdsSection: React.FC<MainAdsSectionProps> = ({ ads, onAdsChange }) => {`,
  `export const MainAdsSection: React.FC<MainAdsSectionProps> = ({ ads, onAddAd, onUpdateAd, onDeleteAd }) => {`
);
code = code.replace(
  /const handleAddAd = \(e: React\.FormEvent\) => \{[\s\S]*?setIsAdding\(false\);\n  \};/m,
  `const handleAddAd = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newImageUrl) return;\n    const newAd = {\n      imageUrl: newImageUrl,\n      title: newTitle,\n      active: true,\n    };\n    if (onAddAd) onAddAd(newAd);\n    setNewImageUrl('');\n    setNewTitle('');\n    setIsAdding(false);\n  };`
);
code = code.replace(
  /const handleToggleActive = \(id: string\) => \{[\s\S]*?\}\);\n  \};/m,
  `const handleToggleActive = (id: string) => {\n    const ad = ads.find((a) => a.id === id);\n    if (ad && onUpdateAd) onUpdateAd({ ...ad, active: !ad.active });\n  };`
);
code = code.replace(
  /const saveEdit = \(e: React\.FormEvent\) => \{[\s\S]*?setEditingId\(null\);\n  \};/m,
  `const saveEdit = (e: React.FormEvent) => {\n    e.preventDefault();\n    const ad = ads.find(a => a.id === editingId);\n    if (ad && onUpdateAd) onUpdateAd({ ...ad, imageUrl: editImageUrl, title: editTitle });\n    setEditingId(null);\n  };`
);
code = code.replace(
  /const handleDelete = \(id: string\) => \{[\s\S]*?\}\);\n    \}\n  \};/m,
  `const handleDelete = (id: string) => {\n    if (confirm('¿Estás seguro de que deseas eliminar esta publicidad?')) {\n      if (onDeleteAd) onDeleteAd(id);\n    }\n  };`
);
fs.writeFileSync('src/components/MainAdsSection.tsx', code);
