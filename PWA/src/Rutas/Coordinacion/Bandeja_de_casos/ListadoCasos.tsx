import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Skeleton } from '../../../Components/UI/Skeleton';
import { Select } from '../../../Components/UI/Select';

const mockCasos = [
  { id: 'CASO-2023-001', origen: 'SOLICITUD_EMPRESA', prioridad: 'ALTA', empresa: 'Alimentos del Caribe SRL', estado: 'PENDIENTE_ANALISIS', fecha: '2023-10-15' },
  { id: 'CASO-2023-002', origen: 'PROGRAMACION', prioridad: 'MEDIA', empresa: 'Lácteos Dominicanos SA', estado: 'PROGRAMADO', fecha: '2023-10-20' },
  { id: 'CASO-2023-003', origen: 'ALERTA_LAPCH', prioridad: 'CRITICA', empresa: 'Distribuidora Central', estado: 'PENDIENTE_ANALISIS', fecha: '2023-10-22' },
];

export const ListadoCasos: React.FC = () => {
  const navigate = useNavigate();
  const [casos, setCasos] = useState(mockCasos);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE_ANALISIS': return 'bg-yellow-100 text-yellow-800';
      case 'PROGRAMADO': return 'bg-blue-100 text-blue-800';
      case 'ASIGNADO': return 'bg-indigo-100 text-indigo-800';
      case 'CERRADO': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityStyle = (prioridad: string) => {
    switch (prioridad) {
      case 'CRITICA': return 'text-red-600 bg-red-100 px-2 rounded-full text-xs font-bold';
      case 'ALTA': return 'text-orange-600';
      case 'MEDIA': return 'text-yellow-600';
      case 'BAJA': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bandeja de Casos</h1>
      </div>

      <div className="bg-white p-4 rounded-md shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select 
          label="Origen" 
          name="origen" 
          options={[
            { value: 'TODOS', label: 'Todos' },
            { value: 'SOLICITUD_EMPRESA', label: 'Solicitud' },
            { value: 'PROGRAMACION', label: 'Programación' },
            { value: 'ALERTA_LAPCH', label: 'Alerta LAPCH' },
            { value: 'DENUNCIA', label: 'Denuncia' },
          ]} 
          className="mb-0"
        />
        <Select 
          label="Estado" 
          name="estado" 
          options={[
            { value: 'TODOS', label: 'Todos' },
            { value: 'PENDIENTE_ANALISIS', label: 'Pendiente Análisis' },
            { value: 'PROGRAMADO', label: 'Programado' },
          ]} 
          className="mb-0"
        />
        <div className="md:col-span-2 flex items-end">
          <Button variant="outline" className="w-full">Filtrar</Button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
          </div>
        ) : casos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No hay casos que coincidan con los filtros.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {casos.map((caso) => (
              <li key={caso.id}>
                <a href={`/bandeja_de_casos/${caso.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate mr-2">{caso.id}</p>
                        <span className={getPriorityStyle(caso.prioridad)}>{caso.prioridad}</span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(caso.estado)}`}>
                          {caso.estado.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {caso.origen.replace('_', ' ')} • {caso.empresa}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Creado: {caso.fecha}</p>
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
