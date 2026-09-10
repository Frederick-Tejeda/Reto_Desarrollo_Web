import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';

export interface FichaTecnica {
  id: string;
  nombre: string;
  version: number;
  estado: 'BORRADOR' | 'PUBLICADO' | 'RETIRADO';
  fechaModificacion: string;
}

const mockFichas: FichaTecnica[] = [
  { id: 'FT-001-v2', nombre: 'Evaluación de Lácteos', version: 2, estado: 'PUBLICADO', fechaModificacion: '2023-08-10' },
  { id: 'FT-001-v3', nombre: 'Evaluación de Lácteos', version: 3, estado: 'BORRADOR', fechaModificacion: '2023-11-01' },
  { id: 'FT-002-v1', nombre: 'Inspección de Cárnicos', version: 1, estado: 'PUBLICADO', fechaModificacion: '2023-01-15' },
];

export const ListadoFichas: React.FC = () => {
  const navigate = useNavigate();
  const [fichas, setFichas] = useState<FichaTecnica[]>(mockFichas);

  const handleCrearFicha = () => {
    // Generamos un ID dummy y lo abrimos en el editor
    const newId = `FT-00${fichas.length + 1}-v1`;
    navigate(`/fichas/editor/${newId}`);
  };

  const handleDuplicar = (ficha: FichaTecnica) => {
    // RF-21.8: Editar una publicada exige duplicar a una nueva versión
    const newFicha: FichaTecnica = {
      ...ficha,
      id: `${ficha.id.split('-v')[0]}-v${ficha.version + 1}`,
      version: ficha.version + 1,
      estado: 'BORRADOR',
      fechaModificacion: new Date().toISOString().split('T')[0]
    };
    setFichas([newFicha, ...fichas]);
    alert(`Se ha duplicado la ficha como la versión v${newFicha.version} (Borrador).`);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración de Fichas (RF-21)</h1>
          <p className="text-sm text-gray-500">Gestión dinámica de formularios de evaluación.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert("Importando estructura validada (RF-21.1)")}>Importar JSON</Button>
          <Button variant="primary" onClick={handleCrearFicha}>Crear Ficha desde cero</Button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {fichas.map((ficha) => (
            <li key={ficha.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-blue-600">{ficha.id}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    ficha.estado === 'PUBLICADO' ? 'bg-green-100 text-green-800' :
                    ficha.estado === 'BORRADOR' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ficha.estado}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{ficha.nombre} (v{ficha.version})</p>
                <p className="text-xs text-gray-500 mt-1">Última modificación: {ficha.fechaModificacion}</p>
              </div>
              
              <div className="flex gap-2">
                {ficha.estado === 'BORRADOR' ? (
                  <Button variant="primary" onClick={() => navigate(`/fichas/editor/${ficha.id}`)}>
                    Editar Borrador
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => handleDuplicar(ficha)}>
                      Duplicar a nueva versión
                    </Button>
                    <Button variant="secondary" onClick={() => alert("Mostrando estadísticas y uso (RF-21.10)")}>
                      Ver Detalles
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
