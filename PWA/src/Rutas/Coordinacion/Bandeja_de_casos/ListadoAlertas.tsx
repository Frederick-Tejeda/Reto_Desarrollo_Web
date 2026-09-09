import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Skeleton } from '../../../Components/UI/Skeleton';

const mockAlertas = [
  { id: 'LAPCH-2023-089', producto: 'Queso Cheddar 500g', empresa: 'Lácteos Dominicanos SA', prioridad: 'CRITICA', estado: 'PENDIENTE', fecha: '2023-10-23' },
  { id: 'LAPCH-2023-090', producto: 'Agua Purificada 5L', empresa: 'Embotelladora del Sur', prioridad: 'ALTA', estado: 'ANALIZADA', fecha: '2023-10-24' },
];

export const ListadoAlertas: React.FC = () => {
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState(mockAlertas);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas LAPCH</h1>
          <p className="text-sm text-gray-500">Gestión de alertas sanitarias emitidas por el laboratorio.</p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
          </div>
        ) : alertas.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No hay alertas LAPCH recientes.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {alertas.map((alerta) => (
              <li key={alerta.id}>
                <a href={`/alertas_lapch/${alerta.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate mr-2">{alerta.id}</p>
                        <span className={`px-2 rounded-full text-xs font-bold ${
                          alerta.prioridad === 'CRITICA' ? 'text-red-600 bg-red-100' : 'text-orange-600 bg-orange-100'
                        }`}>
                          {alerta.prioridad}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          alerta.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {alerta.estado}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {alerta.producto} • {alerta.empresa}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Emitida: {alerta.fecha}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
