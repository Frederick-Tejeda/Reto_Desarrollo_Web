import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Input } from '../../../Components/UI/Input';
import { Select } from '../../../Components/UI/Select';
import { Alert } from '../../../Components/UI/Alert';

export const FormularioProgramacion: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    duracion: '2',
    tecnico: '',
    ficha: 'FICHA-BPM-V3',
    observaciones: ''
  });
  
  const [isSimulatingConflict, setIsSimulatingConflict] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<{type: 'success'|'warning', text: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Simular detección de conflicto si cambia fecha o técnico
    if (name === 'fecha' || name === 'tecnico' || name === 'hora') {
      setConflictMessage(null);
      if (formData.tecnico && formData.fecha) {
        setIsSimulatingConflict(true);
        setTimeout(() => {
          // Lógica de simulación simple: Si escoge 2023-12-25, dar conflicto de feriado.
          if (value === '2023-12-25' || formData.fecha === '2023-12-25') {
            setConflictMessage({ type: 'warning', text: 'Advertencia: La fecha seleccionada es un día feriado nacional.' });
          } else if (name === 'tecnico' && value === 'TEC-002') {
            setConflictMessage({ type: 'warning', text: 'Conflicto de agenda: El técnico seleccionado ya tiene una inspección programada en esta ventana de tiempo.' });
          } else {
            setConflictMessage({ type: 'success', text: 'Técnico disponible en la fecha seleccionada.' });
          }
          setIsSimulatingConflict(false);
        }, 600);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Programación guardada exitosamente.');
    navigate('/programacion');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/programacion')} className="mr-4 text-gray-500 hover:text-gray-700">
          &larr; Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Programar Caso: {id}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Detalles del Caso</h3>
          <p className="text-sm text-gray-600"><strong>Empresa:</strong> Alimentos del Caribe SRL</p>
          <p className="text-sm text-gray-600"><strong>Motivo:</strong> Solicitud de Permiso Sanitario</p>
          <p className="text-sm text-gray-600"><strong>Prioridad Sugerida:</strong> ALTA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Fecha Programada" 
            name="fecha" 
            type="date"
            value={formData.fecha} 
            onChange={handleChange}
            required 
          />
          <Input 
            label="Hora de Inicio" 
            name="hora" 
            type="time"
            value={formData.hora} 
            onChange={handleChange}
            required 
          />
          <Select 
            label="Duración Estimada (Horas)" 
            name="duracion" 
            value={formData.duracion} 
            onChange={handleChange}
            options={[
              { value: '1', label: '1 Hora' },
              { value: '2', label: '2 Horas' },
              { value: '4', label: 'Media Jornada (4 hrs)' },
              { value: '8', label: 'Jornada Completa (8 hrs)' }
            ]}
          />
          <Select 
            label="Ficha a Aplicar" 
            name="ficha" 
            value={formData.ficha} 
            onChange={handleChange}
            options={[
              { value: 'FICHA-BPM-V3', label: 'Inspección BPM v3.0' },
              { value: 'FICHA-ALERTA-V1', label: 'Inspección por Alerta Sanitaria v1.0' }
            ]}
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Asignación de Técnico</h3>
          <Select 
            label="Técnico Evaluador" 
            name="tecnico" 
            value={formData.tecnico} 
            onChange={handleChange}
            options={[
              { value: '', label: 'Seleccione un técnico...' },
              { value: 'TEC-001', label: 'Juan Pérez (Zona Norte)' },
              { value: 'TEC-002', label: 'María Gómez (Zona Sur)' }
            ]}
            required
          />

          {isSimulatingConflict && (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verificando disponibilidad de agenda...
            </div>
          )}

          {conflictMessage && !isSimulatingConflict && (
            <Alert type={conflictMessage.type} className="mt-4">
              {conflictMessage.text}
            </Alert>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones (Opcional)
          </label>
          <textarea
            name="observaciones"
            rows={3}
            className="block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 border"
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate('/programacion')}>
            Cancelar
          </Button>
          <Button type="submit">
            Confirmar Programación
          </Button>
        </div>
      </form>
    </div>
  );
};
