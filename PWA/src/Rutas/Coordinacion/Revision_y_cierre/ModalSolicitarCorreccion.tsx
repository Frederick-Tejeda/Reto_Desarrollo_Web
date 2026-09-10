import React, { useState } from 'react';
import { Button } from '../../../Components/UI/Button';

interface ModalProps {
  onClose: () => void;
  onSubmit: (comentario: string, secciones: string[]) => void;
  titulo: string;
}

export const ModalSolicitarCorreccion: React.FC<ModalProps> = ({ onClose, onSubmit, titulo }) => {
  const [comentario, setComentario] = useState('');
  const [seccionesHabilitadas, setSeccionesHabilitadas] = useState<string[]>([]);

  const SECCIONES_FICHA = [
    { id: 'infra', label: 'Infraestructura' },
    { id: 'higiene', label: 'Higiene y Sanitización' },
    { id: 'docs', label: 'Documentación' }
  ];

  const handleToggle = (id: string) => {
    setSeccionesHabilitadas(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGuardar = () => {
    if (!comentario.trim()) {
      alert("Debe ingresar un comentario o motivo obligatorio.");
      return;
    }
    if (seccionesHabilitadas.length === 0) {
      alert("Debe seleccionar al menos una sección habilitada para que el técnico pueda editar (RF-17.3).");
      return;
    }
    onSubmit(comentario, seccionesHabilitadas);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">{titulo}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Seleccione las secciones que se desbloquearán para el técnico y añada un comentario (RF-17.3 y 17.4). El resto permanecerá bloqueado.
            </p>

            <div className="space-y-4">
              {/* Comentario Obligatorio */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Motivo / Comentario (Obligatorio)</label>
                <textarea 
                  className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={3}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Detalle los errores encontrados..."
                />
              </div>

              {/* Checkboxes de Secciones */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Secciones habilitadas para edición:</label>
                <div className="space-y-2 bg-gray-50 p-3 rounded border">
                  {SECCIONES_FICHA.map(sec => (
                    <label key={sec.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox text-blue-600 rounded"
                        checked={seccionesHabilitadas.includes(sec.id)}
                        onChange={() => handleToggle(sec.id)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{sec.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
            <Button onClick={handleGuardar} className="w-full sm:w-auto">
              Confirmar Devolución
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
