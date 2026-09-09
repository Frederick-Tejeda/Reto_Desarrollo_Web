import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Input } from '../../../Components/UI/Input';
import { Select } from '../../../Components/UI/Select';
import { Alert } from '../../../Components/UI/Alert';
import { DragDropUpload } from '../../../Components/UI/DragDropUpload';

export const FormularioDenuncia: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== 'nueva';

  const [formData, setFormData] = useState({
    tipo: 'Higiene Deficiente',
    fecha: new Date().toISOString().split('T')[0],
    canal: 'Teléfono',
    denunciante: '',
    anonimato: false,
    descripcion: '',
    establecimiento: ''
  });

  const [files, setFiles] = useState<any[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultado, setResultado] = useState<'PROCEDE' | 'NO_PROCEDE' | 'REMITIDA_OTRO_PROCESO' | 'REQUIERE_INFORMACION' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: val }));

    if (name === 'establecimiento' && value.toLowerCase().includes('supermercado central')) {
      setShowDuplicateWarning(true);
    } else if (name === 'establecimiento') {
      setShowDuplicateWarning(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setShowResultModal(true);
    } else {
      alert('Denuncia registrada. Queda pendiente de análisis.');
      navigate('/denuncias');
    }
  };

  const confirmResult = () => {
    alert(`Resultado guardado: ${resultado}. ${resultado === 'PROCEDE' ? 'Caso vinculado creado.' : ''}`);
    navigate('/denuncias');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/denuncias')} className="mr-4 text-gray-500 hover:text-gray-700">
          &larr; Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? `Análisis de Denuncia: ${id}` : 'Registrar Nueva Denuncia'}
        </h1>
      </div>

      {showDuplicateWarning && (
        <Alert type="warning" className="mb-6" title="Posible denuncia duplicada detectada">
          Se han encontrado denuncias recientes para el establecimiento ingresado. Verifique antes de continuar para evitar duplicar el esfuerzo.
        </Alert>
      )}

      <form onSubmit={handleSave} className="bg-white shadow-md rounded-lg p-6 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tipo de Denuncia"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            options={[
              { value: 'Higiene Deficiente', label: 'Higiene Deficiente' },
              { value: 'Sospecha ETAs', label: 'Sospecha de Enfermedad (ETAs)' },
              { value: 'Producto Vencido/Alterado', label: 'Producto Vencido/Alterado' },
              { value: 'Otro', label: 'Otro' }
            ]}
            disabled={isEditing}
          />
          <Input
            label="Fecha de Recepción"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            disabled={isEditing}
            required
          />
          <Select
            label="Canal de Recepción"
            name="canal"
            value={formData.canal}
            onChange={handleChange}
            options={[
              { value: 'Teléfono', label: 'Teléfono' },
              { value: 'Correo', label: 'Correo Electrónico' },
              { value: 'Presencial', label: 'Presencial' },
              { value: 'Redes Sociales', label: 'Redes Sociales' }
            ]}
            disabled={isEditing}
          />
          <Input
            label="Establecimiento / Productos involucrados"
            name="establecimiento"
            value={formData.establecimiento}
            onChange={handleChange}
            placeholder="Ej. Supermercado Central..."
            disabled={isEditing}
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center mb-4">
            <input
              id="anonimato"
              name="anonimato"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.anonimato}
              onChange={handleChange}
              disabled={isEditing}
            />
            <label htmlFor="anonimato" className="ml-2 block text-sm text-gray-900">
              Mantener el anonimato del denunciante
            </label>
          </div>

          {!formData.anonimato && (
            <Input
              label="Datos del Denunciante"
              name="denunciante"
              value={formData.denunciante}
              onChange={handleChange}
              placeholder="Nombre, teléfono, correo..."
              disabled={isEditing}
            />
          )}
          <p className="mt-2 text-xs text-gray-500">Nota: Los datos del denunciante están restringidos por permiso y no se muestran en informes a la empresa (RF-09).</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción Detallada
          </label>
          <textarea
            name="descripcion"
            rows={4}
            className="block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 border"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isEditing}
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Evidencias Adjuntas</h3>
          {isEditing ? (
            <p className="text-sm text-gray-500 italic">No se adjuntaron archivos en la recepción original.</p>
          ) : (
            <DragDropUpload onFilesChange={setFiles} maxFiles={5} />
          )}
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate('/denuncias')}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Emitir Resultado' : 'Registrar Denuncia'}
          </Button>
        </div>
      </form>

      {/* Modal de Resultado */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowResultModal(false)}></div>
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Emitir Resultado del Análisis</h3>

                <Select
                  label="Decisión Final"
                  name="resultado"
                  value={resultado || ''}
                  onChange={(e) => setResultado(e.target.value as any)}
                  options={[
                    { value: '', label: 'Seleccione una decisión...' },
                    { value: 'PROCEDE', label: 'Procede (Crear caso para evaluación)' },
                    { value: 'NO_PROCEDE', label: 'No Procede (Cerrar)' },
                    { value: 'REMITIDA_OTRO_PROCESO', label: 'Remitida a Otro Proceso' },
                    { value: 'REQUIERE_INFORMACION', label: 'Requiere Más Información' }
                  ]}
                />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button onClick={confirmResult} disabled={!resultado} className="w-full sm:ml-3 sm:w-auto">
                  Confirmar
                </Button>
                <Button onClick={() => setShowResultModal(false)} variant="outline" className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
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
