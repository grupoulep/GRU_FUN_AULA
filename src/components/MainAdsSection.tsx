import React, { useState } from 'react';
import { Banner } from '../types';
import { Image as ImageIcon, Plus, Trash2, Edit2, CheckCircle2, XCircle, Save, X } from 'lucide-react';

interface MainAdsSectionProps {
  mainAds: Banner[];
  onMainAdsChange: (mainAds: Banner[]) => void;
}

export const MainAdsSection: React.FC<MainAdsSectionProps> = ({ mainAds, onMainAdsChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    const newMainAd: Banner = {
      id: `banner-${Date.now()}`,
      imageUrl: newImageUrl,
      title: newTitle,
      active: true,
    };
    
    onMainAdsChange([...mainAds, newMainAd]);
    setNewImageUrl('');
    setNewTitle('');
    setIsAdding(false);
  };

  const startEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setEditImageUrl(banner.imageUrl);
    setEditTitle(banner.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageUrl('');
    setEditTitle('');
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editImageUrl) return;
    
    onMainAdsChange(
      mainAds.map((b) => 
        b.id === editingId ? { ...b, imageUrl: editImageUrl, title: editTitle } : b
      )
    );
    cancelEdit();
  };

  const handleToggleActive = (id: string) => {
    onMainAdsChange(
      mainAds.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  const handleDelete = (id: string) => {
    onMainAdsChange(mainAds.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gestión de Publicidad Principal</h2>
          <p className="text-sm text-slate-500 mt-1">
            Agrega y edita los mainAds que se mostrarán en el carrusel del portal del estudiante.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Publicidad</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Agregar Nueva Publicidad</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddBanner} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL de la Imagen *
                </label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/banner.jpg"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Título / Descripción (opcional)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Promoción de verano..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>
            
            {newImageUrl && (
              <div className="mt-4">
                <p className="block text-sm font-medium text-slate-700 mb-1.5">Vista previa:</p>
                <div className="w-full h-32 md:h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
                  <img 
                    src={newImageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => (e.currentTarget.style.display = 'none')} 
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-sm font-bold cursor-pointer transition-colors shadow-xs"
              >
                Guardar Publicidad
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainAds.length === 0 && !isAdding && (
          <div className="col-span-full py-16 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No hay mainAds publicados</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Comienza agregando tu primer banner promocional haciendo clic en "Nueva Publicidad".
            </p>
          </div>
        )}
        
        {mainAds.map((banner) => (
          <div key={banner.id} className={`bg-white border rounded-2xl overflow-hidden shadow-xs flex flex-col transition-all ${editingId === banner.id ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}>
            {editingId === banner.id ? (
              <form onSubmit={saveEdit} className="p-4 flex flex-col h-full space-y-4">
                <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">Editar URL de Imagen</label>
                   <input
                    type="url"
                    required
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">Editar Título</label>
                   <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                {editImageUrl && (
                  <div className="h-24 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <button type="submit" className="flex-1 inline-flex justify-center items-center gap-1.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                  <button type="button" onClick={cancelEdit} className="flex-1 inline-flex justify-center items-center gap-1.5 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="h-48 w-full bg-slate-100 relative group">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      onClick={() => startEdit(banner)}
                      className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white shadow-sm backdrop-blur-md cursor-pointer transition-colors"
                      title="Editar banner"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                     <button
                      onClick={() => handleToggleActive(banner.id)}
                      className={`p-1.5 rounded-lg shadow-sm backdrop-blur-md cursor-pointer transition-colors ${banner.active ? 'bg-emerald-500/90 text-white hover:bg-emerald-600/90' : 'bg-slate-500/90 text-white hover:bg-slate-600/90'}`}
                      title={banner.active ? 'Desactivar banner' : 'Activar banner'}
                    >
                      {banner.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-1.5 rounded-lg bg-rose-500/90 hover:bg-rose-600/90 text-white shadow-sm backdrop-blur-md cursor-pointer transition-colors"
                      title="Eliminar banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {banner.title || 'Sin título'}
                  </h3>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide border ${banner.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {banner.active ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {banner.id.split('-')[1]}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
