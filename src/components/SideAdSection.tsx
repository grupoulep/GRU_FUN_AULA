import React from 'react';
import { SideAd } from '../types';
import { PanelLeft, Save } from 'lucide-react';

interface SideAdSectionProps {
  sideAd: SideAd;
  onSideAdChange: (sideAd: SideAd) => void;
}

export const SideAdSection: React.FC<SideAdSectionProps> = ({ sideAd, onSideAdChange }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const active = formData.get('active') === 'on';
    const imageUrl = formData.get('imageUrl') as string;
    
    onSideAdChange({
      active,
      imageUrl
    });
    alert('Publicidad lateral guardada exitosamente.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
            <PanelLeft className="w-5 h-5 text-blue-600" />
            Publicidad Login (Lateral)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configura una imagen que aparecerá en la parte izquierda de la pantalla de inicio de sesión.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="active" 
              defaultChecked={sideAd.active}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-slate-700">Activar publicidad lateral</span>
          </label>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-1.5">
            URL de la Imagen
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            defaultValue={sideAd.imageUrl}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-colors"
          />
        </div>

        {sideAd.imageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Vista Previa Actual:</p>
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-xl overflow-hidden border border-slate-200">
              <img src={sideAd.imageUrl} alt="Vista previa" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};
