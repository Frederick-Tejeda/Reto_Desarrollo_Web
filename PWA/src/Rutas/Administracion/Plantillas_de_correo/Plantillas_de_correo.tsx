import React, { useState } from 'react';
import { Button } from '../../../Components/UI/Button';

// Mocks para RF-23
interface Plantilla {
  id: string;
  nombre: string;
  asunto: string;
  version: number;
}

interface OutboxTask {
  id: string;
  destinatario: string;
  plantilla: string;
  fecha: string;
  estado: 'ENVIADO' | 'PENDIENTE' | 'FALLIDO';
  diagnostico?: string;
}

const mockPlantillas: Plantilla[] = [
  { id: 'TPL-01', nombre: 'Bienvenida_Registro', asunto: 'Bienvenido a la plataforma', version: 2 },
  { id: 'TPL-02', nombre: 'Asignacion_Caso', asunto: 'Nuevo caso asignado: {{caso_id}}', version: 1 },
];

const mockOutbox: OutboxTask[] = [
  { id: 'MSG-001', destinatario: 'inspector@gob.do', plantilla: 'Asignacion_Caso', fecha: '2023-11-10 10:15:00', estado: 'ENVIADO' },
  { id: 'MSG-002', destinatario: 'empresa@correo.com', plantilla: 'Bienvenida_Registro', fecha: '2023-11-10 11:00:00', estado: 'FALLIDO', diagnostico: 'SMTP Error 554: Transaction failed (RF-23.4)' },
];

export default function Plantillas_de_correo() {
  const [activeTab, setActiveTab] = useState<'PLANTILLAS' | 'OUTBOX'>('PLANTILLAS');
  const [outbox, setOutbox] = useState<OutboxTask[]>(mockOutbox);

  const handleReintentar = (id: string) => {
    alert(`Ejecutando patrón Outbox (RF-23.3): Reintentando envío de correo ${id}...`);
    setOutbox(prev => prev.map(msg => msg.id === id ? { ...msg, estado: 'ENVIADO', diagnostico: 'Resuelto por reintento manual.' } : msg));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración de Correos y Outbox (RF-23)</h1>
        <p className="text-sm text-gray-500">Gestión de plantillas y monitor de envíos asíncronos.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 text-sm font-bold border-b-2 ${activeTab === 'PLANTILLAS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('PLANTILLAS')}
        >
          Plantillas (RF-23.2)
        </button>
        <button 
          className={`px-4 py-2 text-sm font-bold border-b-2 ${activeTab === 'OUTBOX' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('OUTBOX')}
        >
          Monitor Outbox (RF-23.3, 23.4)
        </button>
      </div>

      {activeTab === 'PLANTILLAS' && (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asunto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPlantillas.map(tpl => (
                <tr key={tpl.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tpl.id} <span className="text-gray-400 text-xs ml-1">(v{tpl.version})</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tpl.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tpl.asunto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900" onClick={() => alert("Mostrando editor de plantilla. Nota (RF-23.2): No incluir variables con contraseñas o secretos.")}>Editar Parametrización</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'OUTBOX' && (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-red-50 p-4 border-b border-red-100 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-800 text-sm">Aviso de Regla de Negocio (RF-23.4)</h3>
              <p className="text-xs text-red-700 mt-1">
                Si un correo falla, <strong>NO revierte la transacción de negocio</strong>. El registro se completó exitosamente en la base de datos principal, pero el correo asíncrono falló. Utilice esta consola para diagnosticar y reintentar.
              </p>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Mensaje</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinatario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {outbox.map(msg => (
                <tr key={msg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{msg.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {msg.destinatario}
                    <div className="text-xs text-gray-400 mt-0.5">Plantilla: {msg.plantilla}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      msg.estado === 'ENVIADO' ? 'bg-green-100 text-green-800' : 
                      msg.estado === 'FALLIDO' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {msg.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {msg.diagnostico || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {msg.estado === 'FALLIDO' ? (
                      <button 
                        className="text-blue-600 hover:text-blue-900 font-bold"
                        onClick={() => handleReintentar(msg.id)}
                      >
                        Reintentar Envío
                      </button>
                    ) : (
                      <span className="text-gray-300">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}