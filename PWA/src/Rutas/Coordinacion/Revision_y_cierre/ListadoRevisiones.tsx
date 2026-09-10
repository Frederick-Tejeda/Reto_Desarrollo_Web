import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';

export interface EvaluacionRevision {
  id: string;
  casoId: string;
  empresa: string;
  tecnico: string;
  fechaEnvio: string;
  estado: 'PENDIENTE_REVISION' | 'DEVUELTO' | 'APROBADO';
}

export const mockRevisiones: EvaluacionRevision[] = [
  {
    id: 'EVAL-2023-010',
    casoId: 'CASO-2023-010',
    empresa: 'Lácteos Dominicanos SA',
    tecnico: 'Juan Pérez',
    fechaEnvio: '2023-11-05 10:30',
    estado: 'PENDIENTE_REVISION'
  },
  {
    id: 'EVAL-2023-015',
    casoId: 'CASO-2023-015',
    empresa: 'Carnes del Norte',
    tecnico: 'María Gómez',
    fechaEnvio: '2023-11-06 14:15',
    estado: 'PENDIENTE_REVISION'
  }
];

export const ListadoRevisiones: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Revisión de Evaluaciones (RF-17)</h1>
        <p className="text-sm text-gray-500">Bandeja del coordinador para aprobar o devolver inspecciones terminadas.</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockRevisiones.map((rev) => (
            <li key={rev.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-1">
                    <p className="text-sm font-bold text-blue-600 mr-2">{rev.id}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                      {rev.estado.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-900">{rev.empresa}</p>
                    <p className="text-xs mt-1">
                      <strong>Técnico:</strong> {rev.tecnico} | 
                      <strong> Enviado el:</strong> {rev.fechaEnvio}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => navigate(`/revision_y_cierre/${rev.id}`)}>
                    Revisar Evaluación
                  </Button>
                </div>
              </div>
            </li>
          ))}
          {mockRevisiones.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No hay evaluaciones pendientes de revisión.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
