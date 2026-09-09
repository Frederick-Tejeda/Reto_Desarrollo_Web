import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Skeleton } from '../../../Components/UI/Skeleton';

// Mock data
const mockEmpresas = [
  { id: 1, razonSocial: 'Alimentos del Caribe SRL', rnc: '101010101', estado: 'ACTIVA' },
  { id: 2, razonSocial: 'Lácteos Dominicanos SA', rnc: '202020202', estado: 'PENDIENTE_VALIDACION' },
];

export const ListadoEmpresas: React.FC = () => {

  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState(mockEmpresas);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
        <Button onClick={() => navigate('/empresas/nueva')}>
          + Nueva Empresa
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
          </div>
        ) : empresas.length === 0 ? (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay empresas</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva empresa.</p>
            <div className="mt-6">
              <Button onClick={() => window.location.href = '/empresas/nueva'}>
                Crear Empresa
              </Button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {empresas.map((empresa) => (
              <li key={empresa.id}>
                <a href={`/empresas/${empresa.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{empresa.razonSocial}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${empresa.estado === 'ACTIVA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {empresa.estado.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          RNC: {empresa.rnc}
                        </p>
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
