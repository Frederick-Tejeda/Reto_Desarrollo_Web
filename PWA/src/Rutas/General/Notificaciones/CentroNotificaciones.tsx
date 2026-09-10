import React, { useState } from 'react';
import { Button } from '../../../Components/UI/Button';
import { useNavigate } from 'react-router-dom';

interface Notificacion {
  id: string;
  tipo: 'SISTEMA' | 'CASO' | 'SEGURIDAD';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

const mockNotificaciones: Notificacion[] = [
  { id: 'n1', tipo: 'CASO', titulo: 'Expediente Asignado', mensaje: 'Se te ha asignado el caso CASO-2023-010 para inspección.', fecha: '2023-11-10', leida: false },
  { id: 'n2', tipo: 'SEGURIDAD', titulo: 'Inicio de sesión detectado', mensaje: 'Se detectó un nuevo inicio de sesión desde un dispositivo móvil.', fecha: '2023-11-09', leida: true },
  { id: 'n3', tipo: 'SISTEMA', titulo: 'Mantenimiento Programado', mensaje: 'El sistema estará inactivo de 2:00 AM a 4:00 AM el próximo domingo.', fecha: '2023-11-08', leida: false },
  { id: 'n4', tipo: 'CASO', titulo: 'Corrección Rechazada', mensaje: 'El coordinador ha rechazado tu corrección para el CASO-2023-005.', fecha: '2023-11-05', leida: true },
];

export const CentroNotificaciones: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(mockNotificaciones);
  const [filtroTipo, setFiltroTipo] = useState<string>('TODAS');
  const navigate = useNavigate();

  const handleMarcarLeida = (id: string) => {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  const handleMarcarTodas = () => {
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'CASO': return '📁';
      case 'SEGURIDAD': return '🔒';
      case 'SISTEMA': return '⚙️';
      default: return '🔔';
    }
  };

  const filtradas = notificaciones.filter(n => filtroTipo === 'TODAS' || n.tipo === filtroTipo);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centro de Notificaciones (RF-23.5)</h1>
          <p className="text-sm text-gray-500">Mantente al tanto de las alertas internas del sistema.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>Volver</Button>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold text-gray-500">Filtro:</span>
            <select 
              className="text-sm border-gray-300 rounded p-1 bg-white"
              value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
            >
              <option value="TODAS">Todas</option>
              <option value="CASO">Casos</option>
              <option value="SEGURIDAD">Seguridad</option>
              <option value="SISTEMA">Sistema</option>
            </select>
          </div>
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 font-bold"
            onClick={handleMarcarTodas}
          >
            ✓ Marcar todas como leídas
          </button>
        </div>

        {/* Listado */}
        <ul className="divide-y divide-gray-100">
          {filtradas.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No hay notificaciones para este filtro.</div>
          ) : (
            filtradas.map(n => (
              <li key={n.id} className={`p-4 flex gap-4 items-start ${!n.leida ? 'bg-blue-50' : 'bg-white'}`}>
                <div className="text-2xl mt-1">{getIcon(n.tipo)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm ${!n.leida ? 'font-bold text-blue-900' : 'font-medium text-gray-900'}`}>
                      {n.titulo}
                    </h3>
                    <span className="text-xs text-gray-400">{n.fecha}</span>
                  </div>
                  <p className={`text-sm mt-1 ${!n.leida ? 'text-blue-800' : 'text-gray-500'}`}>{n.mensaje}</p>
                </div>
                {!n.leida && (
                  <button 
                    className="text-xs font-bold bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50 shrink-0"
                    onClick={() => handleMarcarLeida(n.id)}
                  >
                    Marcar Leída
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
