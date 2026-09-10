import React, { useState } from 'react';
import { Button } from '../../../Components/UI/Button';

interface AuditEvent {
  id: string;
  fechaUTC: string;
  actor: string;
  accion: 'LOGIN' | 'UPDATE' | 'CREATE' | 'DELETE' | 'EXPORT';
  recurso: string;
  recursoId: string;
  resultado: 'SUCCESS' | 'FAILED';
  payloadAntes?: any;
  payloadDespues?: any;
}

const mockAuditoria: AuditEvent[] = [
  {
    id: 'EVT-9001', fechaUTC: '2023-11-10T14:32:01Z', actor: 'j.perez@gob.do', accion: 'UPDATE', recurso: 'Caso', recursoId: 'CASO-2023-010', resultado: 'SUCCESS',
    payloadAntes: { riesgo: 'MEDIO', estado: 'EN PROCESO' },
    payloadDespues: { riesgo: 'ALTO', estado: 'EN PROCESO' }
  },
  {
    id: 'EVT-9002', fechaUTC: '2023-11-10T15:10:45Z', actor: 'admin@gob.do', accion: 'LOGIN', recurso: 'Auth', recursoId: '-', resultado: 'SUCCESS',
    payloadAntes: null,
    payloadDespues: { ip: '192.168.1.45', token_jwt: '******** (RF-24.4)', password_hash: '******** (RF-24.4)' }
  },
  {
    id: 'EVT-9003', fechaUTC: '2023-11-11T09:00:12Z', actor: 'hacker@anon.com', accion: 'LOGIN', recurso: 'Auth', recursoId: '-', resultado: 'FAILED',
    payloadAntes: null,
    payloadDespues: { intento: 'Fallo de contraseña', ip: '10.0.0.99' }
  },
];

export default function Auditoria() {
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Contenedor Principal (Tabla) */}
      <div className={`flex-1 flex flex-col p-6 overflow-hidden transition-all duration-300 ${selectedEvent ? 'mr-96' : ''}`}>
        
        <div className="mb-6 flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auditoría y Trazabilidad (RF-24)</h1>
            <p className="text-sm text-gray-500">Registro inmutable de todos los eventos del sistema.</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-bold border border-red-200">
            <span>🔒 SOLO LECTURA</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg flex-1 overflow-hidden border border-gray-200 flex flex-col">
          {/* Toolbar de búsqueda */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4 shrink-0">
            <input type="text" placeholder="Buscar por ID de Recurso..." className="border border-gray-300 rounded p-2 text-sm w-64" />
            <input type="date" className="border border-gray-300 rounded p-2 text-sm" />
            <Button variant="primary">Filtrar</Button>
          </div>

          {/* Data Table */}
          <div className="overflow-y-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha (UTC)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recurso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Detalle</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockAuditoria.map(evt => (
                  <tr key={evt.id} className={`hover:bg-gray-50 ${selectedEvent?.id === evt.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">{evt.fechaUTC}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{evt.actor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded text-xs">{evt.accion}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {evt.recurso} <span className="font-mono text-xs ml-1 text-gray-400">({evt.recursoId})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${evt.resultado === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {evt.resultado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 font-bold"
                        onClick={() => setSelectedEvent(evt)}
                      >
                        Ver Payload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer de Detalle Técnico (Right Panel) */}
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-gray-900 text-gray-300 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col border-l border-gray-700 ${selectedEvent ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800 shrink-0">
          <h2 className="text-lg font-bold text-white">Detalle Técnico</h2>
          <button 
            className="text-gray-400 hover:text-white text-2xl leading-none"
            onClick={() => setSelectedEvent(null)}
          >
            &times;
          </button>
        </div>
        
        {selectedEvent && (
          <div className="p-4 overflow-y-auto flex-1 font-mono text-xs">
            <div className="mb-4 text-gray-400 border-b border-gray-700 pb-2">
              <p>ID: <span className="text-white">{selectedEvent.id}</span></p>
              <p>Fecha: <span className="text-white">{selectedEvent.fechaUTC}</span></p>
            </div>
            
            <h3 className="text-green-400 font-bold mb-2">{'// RF-24.5 Reconstrucción del Evento'}</h3>
            <p className="mb-4 break-words">El usuario <span className="text-white font-bold">{selectedEvent.actor}</span> intentó ejecutar un <span className="text-blue-400 font-bold">{selectedEvent.accion}</span> sobre el recurso <span className="text-yellow-400 font-bold">{selectedEvent.recurso} ({selectedEvent.recursoId})</span>. El resultado fue <span className={selectedEvent.resultado === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}>{selectedEvent.resultado}</span>.</p>

            {selectedEvent.payloadAntes && (
              <div className="mb-4">
                <h4 className="text-yellow-500 font-bold mb-1">State_Before:</h4>
                <pre className="bg-black p-3 rounded overflow-x-auto text-gray-300">
                  {JSON.stringify(selectedEvent.payloadAntes, null, 2)}
                </pre>
              </div>
            )}

            {selectedEvent.payloadDespues && (
              <div className="mb-4">
                <h4 className="text-blue-400 font-bold mb-1">State_After:</h4>
                <pre className="bg-black p-3 rounded overflow-x-auto text-gray-300">
                  {JSON.stringify(selectedEvent.payloadDespues, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-8 border-t border-gray-700 pt-4 text-center opacity-50">
              <p>Nota: Los datos sensibles se ofuscan antes de persistirse en base de datos. (RF-24.4)</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}