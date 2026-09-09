import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Skeleton } from '../../../Components/UI/Skeleton';

const mockCasosPendientes = [
  { id: 'CASO-2023-001', empresa: 'Alimentos del Caribe SRL', prioridad: 'ALTA', fecha: '2023-10-15', tipo: 'Solicitud' },
  { id: 'CASO-2023-004', empresa: 'Lácteos Dominicanos SA', prioridad: 'MEDIA', fecha: '2023-10-18', tipo: 'Control' },
];

export const ListadoProgramacion: React.FC = () => {
  const navigate = useNavigate();
  const [casos, setCasos] = useState(mockCasosPendientes);
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
          <h1 className="text-2xl font-bold text-gray-900">Programación de Evaluaciones</h1>
          <p className="text-sm text-gray-500">Casos procedentes pendientes de asignación de fecha y técnico.</p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
          </div>
        ) : casos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No hay casos pendientes de programación.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {casos.map((caso) => (
              <li key={caso.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 mr-2">{caso.id}</p>
                      <span className={`px-2 rounded-full text-xs font-bold ${
                        caso.prioridad === 'ALTA' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'
                      }`}>
                        {caso.prioridad}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{caso.empresa} • {caso.tipo}</p>
                      <p className="text-xs mt-1">Recibido: {caso.fecha}</p>
                    </div>
                  </div>
                  <div>
                    <Button onClick={() => navigate(`/programacion/${caso.id}`)}>
                      Programar
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
