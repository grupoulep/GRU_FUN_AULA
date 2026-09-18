const fs = require('fs');
let code = fs.readFileSync('src/components/BannersSection.tsx', 'utf8');

code = code.replace(
  `interface BannersSectionProps {\n  banners: Banner[];\n  onBannersChange: (banners: Banner[]) => void;\n}`,
  `interface BannersSectionProps {\n  banners: Banner[];\n  onAddBanner?: (banner: Omit<Banner, 'id'>) => void;\n  onUpdateBanner?: (banner: Banner) => void;\n  onDeleteBanner?: (id: string) => void;\n}`
);
code = code.replace(
  `export const BannersSection: React.FC<BannersSectionProps> = ({ banners, onBannersChange }) => {`,
  `export const BannersSection: React.FC<BannersSectionProps> = ({ banners, onAddBanner, onUpdateBanner, onDeleteBanner }) => {`
);
code = code.replace(
  /const handleAddBanner = \(e: React\.FormEvent\) => \{[\s\S]*?setIsAdding\(false\);\n  \};/m,
  `const handleAddBanner = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newImageUrl) return;\n    const newBanner = {\n      imageUrl: newImageUrl,\n      title: newTitle,\n      active: true,\n    };\n    if (onAddBanner) onAddBanner(newBanner);\n    setNewImageUrl('');\n    setNewTitle('');\n    setIsAdding(false);\n  };`
);
code = code.replace(
  /const handleToggleActive = \(id: string\) => \{[\s\S]*?\}\);\n  \};/m,
  `const handleToggleActive = (id: string) => {\n    const banner = banners.find((b) => b.id === id);\n    if (banner && onUpdateBanner) onUpdateBanner({ ...banner, active: !banner.active });\n  };`
);
code = code.replace(
  /const saveEdit = \(e: React\.FormEvent\) => \{[\s\S]*?setEditingId\(null\);\n  \};/m,
  `const saveEdit = (e: React.FormEvent) => {\n    e.preventDefault();\n    const banner = banners.find(b => b.id === editingId);\n    if (banner && onUpdateBanner) onUpdateBanner({ ...banner, imageUrl: editImageUrl, title: editTitle });\n    setEditingId(null);\n  };`
);
code = code.replace(
  /const handleDelete = \(id: string\) => \{[\s\S]*?\}\);\n    \}\n  \};/m,
  `const handleDelete = (id: string) => {\n    if (confirm('¿Estás seguro de que deseas eliminar este banner?')) {\n      if (onDeleteBanner) onDeleteBanner(id);\n    }\n  };`
);
fs.writeFileSync('src/components/BannersSection.tsx', code);
