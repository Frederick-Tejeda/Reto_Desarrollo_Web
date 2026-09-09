import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../Components/UI/Input';
import { Select } from '../../../Components/UI/Select';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';
import { DragDropUpload } from '../../../Components/UI/DragDropUpload';

export const FormularioSolicitud: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empresa: '',
    establecimiento: '',
    motivo: '',
    tipoEstablecimiento: '',
    observaciones: '',
  });
  
  const [files, setFiles] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.empresa) newErrors.empresa = 'Requerido';
    if (!formData.establecimiento) newErrors.establecimiento = 'Requerido';
    if (!formData.motivo) newErrors.motivo = 'Requerido';
    
    // Si el motivo exige documentos, validamos que haya archivos
    if (formData.motivo === 'solicitud_permiso' && files.length === 0) {
      newErrors.documentos = 'Se requieren documentos para este tipo de solicitud.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setStatusMessage(null);
    setTimeout(() => {
      setIsSaving(false);
      setStatusMessage({ type: 'success', text: 'Borrador guardado localmente.' });
    }, 800);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatusMessage({ type: 'error', text: 'Corrija los errores antes de enviar.' });
      return;
    }
    
    setIsSending(true);
    setStatusMessage(null);
    setTimeout(() => {
      setIsSending(false);
      setStatusMessage({ type: 'success', text: 'Solicitud enviada correctamente. Redirigiendo...' });
      setTimeout(() => navigate('/solicitudes'), 1500);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/solicitudes')} className="mr-4 text-gray-500 hover:text-gray-700">
          &larr; Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Solicitud BPM</h1>
      </div>

      {statusMessage && (
        <Alert type={statusMessage.type} className="mb-6">
          {statusMessage.text}
        </Alert>
      )}

      {errors.documentos && (
        <Alert type="error" className="mb-6">
          {errors.documentos}
        </Alert>
      )}

      <form onSubmit={handleSend} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select 
            label="Empresa" 
            name="empresa" 
            value={formData.empresa} 
            onChange={handleChange}
            options={[{ value: '1', label: 'Alimentos del Caribe SRL' }]}
            error={errors.empresa}
            required 
          />
          <Select 
            label="Establecimiento" 
            name="establecimiento" 
            value={formData.establecimiento} 
            onChange={handleChange}
            options={[
              { value: '1', label: 'Planta Principal' },
              { value: '2', label: 'Almacén Norte' }
            ]}
            error={errors.establecimiento}
            disabled={!formData.empresa}
            required 
          />
          <Select 
            label="Motivo de Inspección" 
            name="motivo" 
            value={formData.motivo} 
            onChange={handleChange}
            options={[
              { value: 'solicitud_permiso', label: 'Solicitud de Permiso Sanitario' },
              { value: 'renovacion', label: 'Renovación' },
              { value: 'certificacion_bpm', label: 'Solicitud de Certificación BPM' },
              { value: 'otro', label: 'Otro' }
            ]}
            error={errors.motivo}
            required 
          />
          <Input 
            label="Tipo de Establecimiento" 
            name="tipoEstablecimiento" 
            value={formData.tipoEstablecimiento} 
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            rows={4}
            className="block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 border"
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Documentación Requerida</h3>
          <p className="text-sm text-gray-500 mb-4">
            Adjunte los documentos requeridos según el motivo de su solicitud.
          </p>
          <DragDropUpload onFilesChange={setFiles} maxFiles={10} accept=".pdf,.png,.jpg,.jpeg" />
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate('/solicitudes')}>
            Cancelar
          </Button>
          <Button type="button" variant="secondary" onClick={handleSaveDraft} isLoading={isSaving} disabled={isSending}>
            Guardar Borrador
          </Button>
          <Button type="submit" isLoading={isSending} disabled={isSaving}>
            Enviar Solicitud
          </Button>
        </div>
      </form>
    </div>
  );
};
