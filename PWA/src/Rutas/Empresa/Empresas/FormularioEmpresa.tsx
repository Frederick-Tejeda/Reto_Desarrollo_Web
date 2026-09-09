import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../Components/UI/Input';
import { Select } from '../../../Components/UI/Select';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';

export const FormularioEmpresa: React.FC = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    razonSocial: '',
    rnc: '',
    nombreComercial: '',
    actividadEconomica: '',
    telefono: '',
    correo: '',
    estado: 'ACTIVA',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.razonSocial) newErrors.razonSocial = 'La razón social es obligatoria.';
    if (!formData.rnc) newErrors.rnc = 'El RNC es obligatorio.';
    else if (!/^[0-9]{9,11}$/.test(formData.rnc)) newErrors.rnc = 'RNC inválido (9 a 11 dígitos).';
    if (!formData.correo) newErrors.correo = 'El correo es obligatorio.';
    else if (!/\S+@\S+\.\S+/.test(formData.correo)) newErrors.correo = 'Formato de correo inválido.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
    }, 1500);
    navigate("/empresas")
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/empresas')} className="mr-4 text-gray-500 hover:text-gray-700">
          &larr; Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Empresa</h1>
      </div>

      {saveStatus === 'error' && Object.keys(errors).length > 0 && (
        <Alert type="error" title="Error de validación" className="mb-6">
          Por favor, corrija los campos marcados en rojo antes de continuar.
        </Alert>
      )}

      {saveStatus === 'success' && (
        <Alert type="success" title="¡Guardado!" className="mb-6">
          La empresa se ha guardado correctamente localmente.
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Razón Social"
            name="razonSocial"
            placeholder="Nombre de la razón social"
            value={formData.razonSocial}
            onChange={handleChange}
            error={errors.razonSocial}
            required
          />
          <Input
            label="RNC"
            name="rnc"
            value={formData.rnc}
            onChange={handleChange}
            error={errors.rnc}
            minLength={9}
            maxLength={11}
            placeholder="123456789"
            helpText="9 u 11 dígitos sin guiones"
            required
          />
          <Input
            label="Nombre Comercial"
            name="nombreComercial"
            placeholder="Nombre comercial de la empresa"
            value={formData.nombreComercial}
            onChange={handleChange}
          />
          <Input
            label="Actividad Económica"
            name="actividadEconomica"
            placeholder="Comercio al por menor"
            value={formData.actividadEconomica}
            onChange={handleChange}
          />
          <Input
            label="Teléfono"
            name="telefono"
            type="tel"
            placeholder="8091234567"
            pattern="[0-9]{10}"
            maxLength={10}
            value={formData.telefono}
            onChange={handleChange}
            error={errors.telefono}
            required
          />
          <Input
            label="Correo Electrónico"
            name="correo"
            type="email"
            placeholder="user@mail.com"
            value={formData.correo}
            onChange={handleChange}
            error={errors.correo}
            required
          />
          <Select
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            options={[
              { value: 'ACTIVA', label: 'Activa' },
              { value: 'PENDIENTE_VALIDACION', label: 'Pendiente de Validación' },
              { value: 'SUSPENDIDA', label: 'Suspendida' }
            ]}
            required
          />
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate('/empresas')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Guardar Empresa
          </Button>
        </div>
      </form>
    </div>
  );
};
