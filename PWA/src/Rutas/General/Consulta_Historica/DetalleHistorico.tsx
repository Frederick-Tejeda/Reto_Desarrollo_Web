import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';

export const DetalleHistorico: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock Timeline Events (RF-20.3)
  const eventos = [
    { 
      fecha: '2023-10-01 09:00', 
      titulo: 'Caso Asignado', 
      descripcion: 'Asignado al técnico Juan Pérez.', 
      color: 'bg-blue-500' 
    },
    { 
      fecha: '2023-11-05 14:30', 
      titulo: 'Evaluación Completada (Ficha v2)', 
      descripcion: 'Sincronizada offline. Calificación parcial: 92/100.', 
      color: 'bg-green-500' 
    },
    { 
      fecha: '2023-11-06 10:00', 
      titulo: 'Revisión del Coordinador', 
      descripcion: 'Devuelto solicitando corrección en ítem de Infraestructura.', 
      color: 'bg-yellow-500' 
    },
    { 
      fecha: '2023-11-08 16:15', 
      titulo: 'Corrección Recibida', 
      descripcion: 'La empresa adjuntó fotografías y justificación.', 
      color: 'bg-purple-500' 
    },
    { 
      fecha: '2023-11-10 11:00', 
      titulo: 'Expediente Cerrado (Informe Emitido)', 
      descripcion: 'Decisión final aprobada. Riesgo Final: ALTO.', 
      color: 'bg-gray-800' 
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Línea de Tiempo (RF-20.3)</h1>
          <p className="text-sm text-gray-500">Historial completo para el expediente: <strong className="text-blue-600">{id}</strong></p>
        </div>
        <Button variant="outline" onClick={() => navigate('/consulta_historica')}>Volver a Búsqueda</Button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <h3 className="font-bold text-blue-800">Próxima Visita Sugerida</h3>
        <p className="text-sm text-blue-700 mt-1">10 de Mayo, 2024 (Basado en Frecuencia por Riesgo Alto)</p>
      </div>

      <div className="relative border-l-2 border-gray-200 ml-4 md:ml-6 space-y-8">
        {eventos.map((evt, idx) => (
          <div key={idx} className="relative pl-6">
            <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-2 border-white ${evt.color}`}></div>
            <div className="bg-white shadow rounded-lg p-4 border border-gray-100">
              <span className="text-xs font-bold text-gray-500">{evt.fecha}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">{evt.titulo}</h3>
              <p className="text-sm text-gray-600 mt-2">{evt.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
