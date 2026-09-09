import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Tabs } from '../../../Components/UI/Tabs';
import type { TabItem } from '../../../Components/UI/Tabs';
import { Alert } from '../../../Components/UI/Alert';

export const DetalleCaso: React.FC = () => {
  const navigate = useNavigate();
  // We mock the ID, in reality we would use useParams()
  const { id } = useParams<{ id: string }>() || { id: 'CASO-2023-001' };

  const [activeTab, setActiveTab] = useState('resumen');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'PROCEDE' | 'NO_PROCEDE' | 'REQUIERE_INFO' | null>(null);
  const [motivo, setMotivo] = useState('');
  const [estadoCaso, setEstadoCaso] = useState('PENDIENTE_ANALISIS');

  const handleActionClick = (action: 'PROCEDE' | 'NO_PROCEDE' | 'REQUIERE_INFO') => {
    setModalAction(action);
    setMotivo('');
    setShowModal(true);
  };

  const confirmAction = () => {
    if (!motivo.trim() && modalAction !== 'PROCEDE') {
      // Motivo es obligatorio para no procede y requiere info (simplificado)
      alert("El motivo es obligatorio");
      return;
    }

    // Simulate updating case
    if (modalAction === 'PROCEDE') setEstadoCaso('PROGRAMADO'); // Pasa a pendiente programación o programado
    if (modalAction === 'NO_PROCEDE') setEstadoCaso('CERRADO_NO_PROCEDE');

    setShowModal(false);
  };

  const tabItems: TabItem[] = [
    {
      id: 'resumen',
      label: 'Resumen e Hitos',
      content: (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Línea de Tiempo del Caso</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Caso Creado</p>
                <p className="text-sm text-gray-500">Por Solicitud de Empresa - 15 Oct 2023</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-yellow-500"></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">En Análisis</p>
                <p className="text-sm text-gray-500">Esperando decisión del coordinador - 16 Oct 2023</p>
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'programacion',
      label: 'Programación',
      content: (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">No hay programación asignada aún.</p>
        </div>
      )
    },
    {
      id: 'evaluaciones',
      label: 'Evaluaciones',
      content: (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">No hay evaluaciones para este caso.</p>
        </div>
      )
    },
    {
      id: 'evidencias',
      label: 'Evidencias',
      content: (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Archivos adjuntos a la solicitud:</p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center text-sm text-blue-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path></svg>
              formulario_solicitud.pdf
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Encabezado Fijo */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 sticky top-0 z-10 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center">
              <button onClick={() => navigate('/bandeja_de_casos')} className="mr-4 text-gray-500 hover:text-gray-700">
                &larr; Volver
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Expediente {id || 'CASO-2023-001'}</h1>
              <span className="ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {estadoCaso.replace('_', ' ')}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Establecimiento: <span className="font-medium text-gray-900">Planta Principal (Alimentos del Caribe SRL)</span> |
              Origen: <span className="font-medium text-gray-900">Solicitud de Empresa</span>
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            {estadoCaso === 'PENDIENTE_ANALISIS' && (
              <>
                <Button variant="danger" onClick={() => handleActionClick('NO_PROCEDE')}>
                  No Procede
                </Button>
                <Button variant="secondary" onClick={() => handleActionClick('REQUIERE_INFO')}>
                  Requerir Info
                </Button>
                <Button onClick={() => handleActionClick('PROCEDE')}>
                  Procede
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {estadoCaso === 'CERRADO_NO_PROCEDE' && (
        <Alert type="error" title="Caso Cerrado" className="mb-6">
          Este caso ha sido marcado como NO PROCEDE.
        </Alert>
      )}

      {/* Pestañas */}
      <Tabs
        tabs={tabItems}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
      />

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
                      Confirmar Acción: {modalAction?.replace('_', ' ')}
                    </h3>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Motivo (Obligatorio)</label>
                      <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Especifique el motivo de esta decisión..."
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
