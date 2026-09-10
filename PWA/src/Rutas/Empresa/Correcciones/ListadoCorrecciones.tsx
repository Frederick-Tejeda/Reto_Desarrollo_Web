import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';

export interface Correccion {
  id: string;
  casoId: string;
  tipo: 'FICHA' | 'MEDIDA_CORRECTIVA';
  observaciones: string;
  fechaLimite: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA' | 'VENCIDA';
}

export const mockCorrecciones: Correccion[] = [
  {
    id: 'CORR-2023-001',
    casoId: 'CASO-2023-010',
    tipo: 'FICHA',
    observaciones: 'Por favor corregir sección Infraestructura. Se requieren fotos de la nueva rampa.',
    fechaLimite: '2023-11-20',
    estado: 'PENDIENTE'
  },
  {
    id: 'MC-2023-005',
    casoId: 'CASO-2023-012',
    tipo: 'MEDIDA_CORRECTIVA',
    observaciones: 'Instalación de dispensadores de jabón automáticos en baños principales.',
    fechaLimite: '2023-12-01',
    estado: 'EN_PROCESO'
  },
  {
    id: 'CORR-2023-002',
    casoId: 'CASO-2023-015',
    tipo: 'FICHA',
    observaciones: 'Actualizar registro de control de plagas.',
    fechaLimite: '2023-11-10',
    estado: 'ENVIADA'
  }
];

export const ListadoCorrecciones: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'FICHA' | 'MEDIDA_CORRECTIVA'>('FICHA');

  const filteredCorrecciones = mockCorrecciones.filter(c => c.tipo === activeTab);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_PROCESO': return 'bg-blue-100 text-blue-800';
      case 'ENVIADA': return 'bg-purple-100 text-purple-800';
      case 'ACEPTADA': return 'bg-green-100 text-green-800';
      case 'RECHAZADA': return 'bg-red-100 text-red-800';
      case 'VENCIDA': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Correcciones (RF-18)</h1>
        <p className="text-sm text-gray-500">Bandeja de entrada para resolver devoluciones y planes de acción.</p>
      </div>

      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('FICHA')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'FICHA' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Correcciones a Evaluación
          </button>
          <button
            onClick={() => setActiveTab('MEDIDA_CORRECTIVA')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'MEDIDA_CORRECTIVA' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Medidas Correctivas
          </button>
        </nav>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredCorrecciones.map((corr) => (
            <li key={corr.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 max-w-2xl">
                  <div className="flex items-center mb-1">
                    <p className="text-sm font-bold text-blue-600 mr-2">{corr.id}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(corr.estado)}`}>
                      {corr.estado.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <p className="font-medium text-gray-900 line-clamp-2">"{corr.observaciones}"</p>
                    <p className="text-xs mt-1">
                      <strong>Caso:</strong> {corr.casoId} | 
                      <strong className={new Date(corr.fechaLimite) < new Date() ? 'text-red-600' : ''}> Límite: {corr.fechaLimite}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/correcciones/${corr.id}`)}
                  >
                    {corr.estado === 'ENVIADA' || corr.estado === 'ACEPTADA' ? 'Ver Detalles' : 'Atender'}
                  </Button>
                </div>
              </div>
            </li>
          ))}
          {filteredCorrecciones.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No hay registros en esta categoría.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
