import React, { useState } from 'react';
import { CentralAnnouncement } from '../types';
import { Megaphone, Save, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface CentralAnnouncementSectionProps {
  announcement: CentralAnnouncement;
  onUpdateAnnouncement: (announcement: CentralAnnouncement) => void;
}

export const CentralAnnouncementSection: React.FC<CentralAnnouncementSectionProps> = ({
  announcement,
  onUpdateAnnouncement
}) => {
  const [title, setTitle] = useState(announcement.title);
  const [content, setContent] = useState(announcement.content);
  const [imageUrl, setImageUrl] = useState(announcement.imageUrl || '');
  const [active, setActive] = useState(announcement.active);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAnnouncement({
      title,
      content,
      imageUrl: imageUrl.trim() || undefined,
      active
    });
    setSuccessMessage('¡Anuncio central actualizado exitosamente!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  return (
    <div id="central-announcement-section" className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-blue-700" />
            <span>Configurar Anuncio Central</span>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Este anuncio aparecerá en pantalla completa para los estudiantes al iniciar sesión.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center h-5">
              <input
                id="announcement-active"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="text-sm">
              <label htmlFor="announcement-active" className="font-medium text-slate-900 cursor-pointer">
                Habilitar anuncio central
              </label>
              <p className="text-slate-500 text-xs">Si está habilitado, los estudiantes lo verán al entrar.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="announcement-title" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Título del Anuncio
              </label>
              <input
                id="announcement-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. ¡Bienvenidos al semestre!"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div>
              <label htmlFor="announcement-content" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mensaje Principal
              </label>
              <textarea
                id="announcement-content"
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe el mensaje o indicaciones para los estudiantes..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
              />
            </div>

            <div>
              <label htmlFor="announcement-image" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                URL de Imagen (Opcional)
              </label>
              <input
                id="announcement-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
      
      {/* Vista previa */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Vista Previa</h3>
        <div className="border-4 border-slate-800 rounded-2xl overflow-hidden shadow-lg bg-white relative aspect-video md:aspect-[21/9] flex items-center justify-center">
           {!active && (
             <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-sm z-10 flex items-center justify-center flex-col">
               <Megaphone className="w-10 h-10 text-slate-400 mb-2" />
               <span className="text-slate-500 font-medium">El anuncio está inactivo</span>
             </div>
           )}
           {imageUrl && (
              <img src={imageUrl} alt="Fondo" className="absolute inset-0 w-full h-full object-cover opacity-20" />
           )}
           <div className="relative z-10 p-8 max-w-2xl text-center bg-white/90 backdrop-blur rounded-2xl shadow-xl m-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{title || 'Título del anuncio'}</h2>
              <p className="text-slate-700">{content || 'Contenido del anuncio...'}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
