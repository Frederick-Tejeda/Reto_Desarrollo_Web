import React, { useState, useEffect } from 'react';
import { Button } from '../../../Components/UI/Button';
import { Skeleton } from '../../../Components/UI/Skeleton';

// Mock data
const mockEstablecimientos = [
  { id: 1, empresaId: 1, nombre: 'Planta Principal', municipio: 'Santo Domingo Este', telefono: '809-555-0001' },
  { id: 2, empresaId: 1, nombre: 'Almacén Norte', municipio: 'Santiago de los Caballeros', telefono: '809-555-0002' },
];

export const ListadoEstablecimientos: React.FC = () => {
  const [establecimientos, setEstablecimientos] = useState(mockEstablecimientos);
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
        <h1 className="text-2xl font-bold text-gray-900">Establecimientos</h1>
        <Button onClick={() => window.location.href = '/establecimientos/nuevo'}>
          + Nuevo Establecimiento
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
          </div>
        ) : establecimientos.length === 0 ? (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay establecimientos</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo establecimiento.</p>
            <div className="mt-6">
              <Button onClick={() => window.location.href = '/establecimientos/nuevo'}>
                Crear Establecimiento
              </Button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {establecimientos.map((est) => (
              <li key={est.id}>
                <a href={`/establecimientos/${est.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{est.nombre}</p>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {est.municipio} • Tel: {est.telefono}
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
