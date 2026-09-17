import React from 'react';
import { PasswordRecoveryRequest } from '../types';
import { CheckCircle2, Clock, Mail } from 'lucide-react';

interface PasswordRecoverySectionProps {
  recoveryRequests: PasswordRecoveryRequest[];
  onApproveRecovery: (id: string) => void;
}

export const PasswordRecoverySection: React.FC<PasswordRecoverySectionProps> = ({
  recoveryRequests,
  onApproveRecovery
}) => {
  const pendingRequests = recoveryRequests.filter(req => req.status === 'pending');
  const otherRequests = recoveryRequests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
            Recuperación de Contraseñas
            <span className="bg-blue-100 text-blue-800 text-xs py-0.5 px-2 rounded-full font-medium">
              {pendingRequests.length} pendientes
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de solicitudes de restablecimiento de contraseña de usuarios.
          </p>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Todo al día</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            No hay solicitudes pendientes de recuperación de contraseña en este momento.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="py-3 px-4 font-semibold">Identificador (Correo/Cédula)</th>
                  <th className="py-3 px-4 font-semibold">Fecha de Solicitud</th>
                  <th className="py-3 px-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-900">{req.identifier}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {new Date(req.requestDate).toLocaleString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onApproveRecovery(req.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                      >
                        Aprobar (Sí)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {otherRequests.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Historial de Solicitudes (Aprobadas / Completadas)
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-4 font-semibold">Identificador</th>
                    <th className="py-2.5 px-4 font-semibold">Estado</th>
                    <th className="py-2.5 px-4 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {otherRequests.slice(0, 10).map(req => (
                    <tr key={req.id}>
                      <td className="py-2 px-4 font-medium text-slate-700">{req.identifier}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          req.status === 'completed' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {req.status === 'completed' ? 'Completado' : 'Aprobado'}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-slate-500">
                        {new Date(req.requestDate).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
