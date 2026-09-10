import React from 'react';
import { Button } from '../../../Components/UI/Button';
import type { InspeccionEvent } from './Agenda';
import { useNavigate } from 'react-router-dom';

interface DetalleEventoModalProps {
  evento: InspeccionEvent;
  onClose: () => void;
}

export const DetalleEventoModal: React.FC<DetalleEventoModalProps> = ({ evento, onClose }) => {
  const navigate = useNavigate();

  const handleComenzar = () => {
    onClose();
    navigate('/ejecucion'); // Redirigir a RF-12
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                  {evento.empresa}
                </h3>
                <p className="text-sm text-gray-500">{evento.id}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${evento.prioridad === 'ALTA' ? 'text-red-700 bg-red-100' : 'text-yellow-700 bg-yellow-100'
                }`}>
                {evento.prioridad}
              </span>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Establecimiento:</strong> {evento.establecimiento}</p>
              <p><strong>Dirección:</strong> {evento.direccion}</p>
              <p><strong>Fecha y Hora:</strong> {evento.start?.toLocaleString()} - {evento.end?.toLocaleString()}</p>
              <p><strong>Estado:</strong> {evento.estado}</p>

              <div className="flex items-center mt-2 p-2 bg-gray-50 rounded">
                <span className="mr-2">Disponibilidad Offline:</span>
                {evento.disponibleOffline ? (
                  <span className="text-green-600 font-bold flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Descargado
                  </span>
                ) : (
                  <span className="text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    No disponible
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-3 rounded">
              <p><strong>RF-11.3:</strong> Solo roles autorizados podrán reprogramar mediante acción explícita.</p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
            <Button onClick={handleComenzar} className="w-full sm:w-auto">
              {evento.estado === 'FINALIZADO' ? 'Ver Resultados' : 'Ir a Ejecución (RF-12)'}
            </Button>
            <Button onClick={() => alert("Simulación: Solicitando reprogramación al coordinador...")} variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">
              Solicitar Reprogramación
            </Button>
            <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto mt-2 sm:mt-0">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
