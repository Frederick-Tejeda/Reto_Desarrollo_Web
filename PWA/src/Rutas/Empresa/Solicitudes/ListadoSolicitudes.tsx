import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Skeleton } from '../../../Components/UI/Skeleton';

const mockSolicitudes = [
  { id: 'SOL-2023-001', empresa: 'Alimentos del Caribe SRL', establecimiento: 'Planta Principal', motivo: 'Renovación de Permiso', estado: 'PENDIENTE_ANALISIS', fecha: '2023-10-15' },
  { id: 'SOL-2023-002', empresa: 'Alimentos del Caribe SRL', establecimiento: 'Almacén Norte', motivo: 'Certificación BPM', estado: 'BORRADOR', fecha: '2023-10-20' },
];

export const ListadoSolicitudes: React.FC = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState(mockSolicitudes);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'BORRADOR': return 'bg-gray-100 text-gray-800';
      case 'PENDIENTE_ANALISIS': return 'bg-yellow-100 text-yellow-800';
      case 'APROBADA': return 'bg-green-100 text-green-800';
      case 'RECHAZADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes</h1>
        <Button onClick={() => navigate('/solicitudes/nueva')}>
          + Nueva Solicitud
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
            <p className="mt-1 text-sm text-gray-500">Cree una nueva solicitud para iniciar el proceso.</p>
            <div className="mt-6">
              <Button onClick={() => navigate('/solicitudes/nueva')}>
                Nueva Solicitud
              </Button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {solicitudes.map((sol) => (
              <li key={sol.id}>
                <a href={`/solicitudes/${sol.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{sol.id} - {sol.motivo}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(sol.estado)}`}>
                          {sol.estado.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {sol.establecimiento} ({sol.empresa})
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Creada: {sol.fecha}</p>
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
