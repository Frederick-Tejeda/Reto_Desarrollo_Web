import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';

export const DetalleAlerta: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>() || { id: 'LAPCH-2023-089' };
  
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'PROCEDE_EVALUACION' | 'NO_PROCEDE' | 'REQUIERE_INFO' | null>(null);
  const [motivo, setMotivo] = useState('');
  const [estado, setEstado] = useState('PENDIENTE');

  const handleActionClick = (action: 'PROCEDE_EVALUACION' | 'NO_PROCEDE' | 'REQUIERE_INFO') => {
    setModalAction(action);
    setMotivo('');
    setShowModal(true);
  };

  const confirmAction = () => {
    if (modalAction === 'NO_PROCEDE' && !motivo.trim()) {
      alert("Para cerrar sin evaluación (No Procede) el motivo es obligatorio según RF-08.");
      return;
    }
    
    setEstado('ANALIZADA');
    setShowModal(false);
    
    if (modalAction === 'PROCEDE_EVALUACION') {
      alert("Alerta analizada. Se ha creado el caso vinculado y se redirigirá a programación.");
      navigate('/programacion');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/alertas_lapch')} className="mr-4 text-gray-500 hover:text-gray-700">
            &larr; Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Alerta {id || 'LAPCH-2023-089'}</h1>
          <span className="ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            CRÍTICA
          </span>
          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {estado}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Alerta</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Producto Involucrado</p>
                <p className="mt-1 text-sm text-gray-900">Queso Cheddar 500g (Lote: A2390)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Empresa / Establecimiento</p>
                <p className="mt-1 text-sm text-gray-900">Lácteos Dominicanos SA - Planta Sur</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Recepción</p>
                <p className="mt-1 text-sm text-gray-900">23 Oct 2023 09:45 AM</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fuente Interna</p>
                <p className="mt-1 text-sm text-gray-900">Laboratorio Nacional (LAPCH)</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500">Descripción / Hallazgos</p>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                Se detectó presencia de Listeria monocytogenes en la muestra M-4929 recolectada durante el muestreo de control en el mercado.
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos Adjuntos</h3>
            <ul className="border rounded-md divide-y divide-gray-200">
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 flex-1 w-0 truncate">
                    informe_laboratorio_LAPCH_4929.pdf
                  </span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Descargar</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis del Coordinador</h3>
            {estado === 'PENDIENTE' ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">
                  Seleccione cómo proceder con esta alerta. Si procede, se creará automáticamente un caso sin duplicar datos.
                </p>
                <Button className="w-full" onClick={() => handleActionClick('PROCEDE_EVALUACION')}>
                  Procede Evaluación
                </Button>
                <Button variant="danger" className="w-full" onClick={() => handleActionClick('NO_PROCEDE')}>
                  No Procede (Cerrar)
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => handleActionClick('REQUIERE_INFO')}>
                  Requiere Información
                </Button>
              </div>
            ) : (
              <Alert type="success">
                Esta alerta ya fue analizada y procesada.
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Acción */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Confirmar Decisión: {modalAction?.replace('_', ' ')}
                    </h3>
                    
                    {modalAction === 'NO_PROCEDE' && (
                      <div className="mt-2">
                        <Alert type="warning" message="Según RF-08, cerrar sin evaluación exige una decisión motivada." />
                      </div>
                    )}

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Motivo {modalAction === 'NO_PROCEDE' ? '(Obligatorio)' : '(Opcional)'}
                      </label>
                      <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Justifique la decisión tomada..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button 
                  onClick={confirmAction}
                  variant={modalAction === 'NO_PROCEDE' ? 'danger' : 'primary'}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirmar
                </Button>
                <Button 
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 text-base font-medium text-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
