import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';

export interface InformeData {
  id: string;
  casoId: string;
  empresa: string;
  establecimiento: string;
  version: number;
  estado: 'BORRADOR' | 'EMITIDO';
  fecha: string;
  emisor: string;
  hash?: string;
  calificacion: number;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
}

export const mockInformes: InformeData[] = [
  {
    id: 'INF-2023-010-v1',
    casoId: 'CASO-2023-010',
    empresa: 'Lácteos Dominicanos SA',
    establecimiento: 'Planta Sur',
    version: 1,
    estado: 'EMITIDO',
    fecha: '2023-11-05',
    emisor: 'Coordinador C-01',
    hash: 'a8f5f167f44f4964e6c998dee827110c',
    calificacion: 85,
    riesgo: 'MEDIO'
  },
  {
    id: 'INF-2023-012-v1',
    casoId: 'CASO-2023-012',
    empresa: 'Distribuidora Central',
    establecimiento: 'Almacén Principal',
    version: 1,
    estado: 'BORRADOR',
    fecha: '2023-11-08',
    emisor: 'Técnico T-02',
    calificacion: 92,
    riesgo: 'BAJO'
  }
];

export const ListadoInformes: React.FC = () => {
  const navigate = useNavigate();
  const [informes, setInformes] = useState<InformeData[]>(mockInformes);

  const handleVerInforme = (id: string) => {
    navigate(`/informes/${id}`);
  };

  const handleRegenerar = (informe: InformeData) => {
    // Simula la creación de una nueva versión (RF-16.4)
    const newVersion = informe.version + 1;
    const newId = `${informe.id.split('-v')[0]}-v${newVersion}`;
    
    const nuevoInforme: InformeData = {
      ...informe,
      id: newId,
      version: newVersion,
      estado: 'BORRADOR',
      fecha: new Date().toISOString().split('T')[0],
      hash: undefined, // El hash se genera al emitir
    };

    setInformes(prev => [nuevoInforme, ...prev]);
    alert(`Se ha regenerado el informe como nueva versión (${newVersion}).`);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informes de Evaluación (RF-16)</h1>
          <p className="text-sm text-gray-500">Historial y versiones de los informes generados.</p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {informes.map((informe) => (
            <li key={informe.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-1">
                    <p className="text-sm font-bold text-blue-600 mr-2">{informe.id}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      informe.estado === 'EMITIDO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {informe.estado}
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                      v{informe.version}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-900">{informe.empresa} - {informe.establecimiento}</p>
                    <p className="text-xs mt-1">
                      <strong>Caso:</strong> {informe.casoId} | 
                      <strong> Emisor:</strong> {informe.emisor} | 
                      <strong> Fecha:</strong> {informe.fecha}
                    </p>
                    {informe.hash && (
                      <p className="text-xs mt-1 font-mono text-gray-400">Hash: {informe.hash.substring(0,16)}...</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleVerInforme(informe.id)}>
                    Ver Informe HTML
                  </Button>
                  <Button variant="secondary" onClick={() => handleRegenerar(informe)}>
                    Regenerar (v{informe.version + 1})
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
