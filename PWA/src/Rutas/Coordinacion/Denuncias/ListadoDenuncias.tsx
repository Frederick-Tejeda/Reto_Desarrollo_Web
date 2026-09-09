import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Skeleton } from '../../../Components/UI/Skeleton';

const mockDenuncias = [
  { id: 'DEN-2023-045', establecimiento: 'Supermercado Central', fecha: '2023-10-25', estado: 'NUEVA', tipo: 'Higiene Deficiente' },
  { id: 'DEN-2023-046', establecimiento: 'Comedor Estudiantil 12', fecha: '2023-10-26', estado: 'ANALIZADA', tipo: 'Sospecha ETAs' },
];

export const ListadoDenuncias: React.FC = () => {
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState(mockDenuncias);
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Denuncias y Reportes</h1>
          <p className="text-sm text-gray-500">Recepción, análisis y derivación de denuncias de terceros.</p>
        </div>
        <Button onClick={() => navigate('/denuncias/nueva')}>
          + Registrar Denuncia
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
          </div>
        ) : denuncias.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No hay denuncias registradas.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {denuncias.map((denuncia) => (
              <li key={denuncia.id}>
                <a href={`/denuncias/${denuncia.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate mr-2">{denuncia.id}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          denuncia.estado === 'NUEVA' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {denuncia.estado}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {denuncia.tipo} • {denuncia.establecimiento}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Recibida: {denuncia.fecha}</p>
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
