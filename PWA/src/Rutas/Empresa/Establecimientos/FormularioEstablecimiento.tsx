import React, { useState } from 'react';
import { Input } from '../../../Components/UI/Input';
import { Select } from '../../../Components/UI/Select';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';
import { GeoLocationPicker } from '../../../Components/UI/GeoLocationPicker';
import { 
  mockProvincias, 
  mockMunicipios, 
  mockDPS_DAS, 
  mockComercializacion, 
  mockMercadoObjetivo, 
  mockCategoriasAlimentos, 
  mockSubcategoriasAlimentos 
} from '../../../api/mocks/catalogos';

export const FormularioEstablecimiento: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    calle: '',
    numero: '',
    provincia: '',
    municipio: '',
    dpsDas: '',
    telefono: '',
    correo: '',
    comercializacion: '',
    mercadoObjetivo: '',
    categoriaAlimento: '',
    subcategoriaAlimento: '',
    haccp: '',
    planMuestreo: '',
    inabie: '',
    // Dynamic fields
    nivelImplementacionHaccp: '',
    dondeAplicanMuestreo: '',
    comoDistribuyenInabie: '',
  });
  
  const [locationData, setLocationData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.provincia) newErrors.provincia = 'La provincia es obligatoria.';
    if (!formData.municipio) newErrors.municipio = 'El municipio es obligatorio.';
    if (!formData.dpsDas) newErrors.dpsDas = 'El DPS/DAS es obligatorio.';
    if (!formData.comercializacion) newErrors.comercializacion = 'La comercialización es obligatoria.';
    if (!formData.mercadoObjetivo) newErrors.mercadoObjetivo = 'El mercado objetivo es obligatorio.';
    if (!formData.categoriaAlimento) newErrors.categoriaAlimento = 'La categoría de alimento es obligatoria.';
    if (!formData.subcategoriaAlimento) newErrors.subcategoriaAlimento = 'La subcategoría es obligatoria.';
    
    // Dynamic fields validation
    if (formData.haccp === 'si' && !formData.nivelImplementacionHaccp) {
      newErrors.nivelImplementacionHaccp = 'Seleccione el nivel de implementación.';
    }
    if (formData.planMuestreo === 'si' && !formData.dondeAplicanMuestreo) {
      newErrors.dondeAplicanMuestreo = 'Especifique dónde lo aplican.';
    }
    if (formData.inabie === 'si' && !formData.comoDistribuyenInabie) {
      newErrors.comoDistribuyenInabie = 'Especifique cómo lo distribuyen.';
    }

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
    
    // Data to be saved includes formData and locationData
    const payload = {
      ...formData,
      geolocalizacion: locationData
    };
    
    console.log("Saving...", payload);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      
      // Handle conditional resets
      if (name === 'provincia') next.municipio = '';
      if (name === 'categoriaAlimento') next.subcategoriaAlimento = '';
      if (name === 'haccp' && value === 'no') next.nivelImplementacionHaccp = '';
      if (name === 'planMuestreo' && value === 'no') next.dondeAplicanMuestreo = '';
      if (name === 'inabie' && value === 'no') next.comoDistribuyenInabie = '';
      
      return next;
    });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => window.history.back()} className="mr-4 text-gray-500 hover:text-gray-700">
          &larr; Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Establecimiento</h1>
      </div>

      {saveStatus === 'error' && Object.keys(errors).length > 0 && (
        <Alert type="error" title="Error de validación" className="mb-6">
          Por favor, corrija los campos marcados en rojo antes de continuar.
        </Alert>
      )}

      {saveStatus === 'success' && (
        <Alert type="success" title="¡Guardado!" className="mb-6">
          El establecimiento se ha guardado correctamente.
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-8">
        
        {/* Sección: Datos Generales */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Datos Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nombre del Establecimiento" name="nombre" value={formData.nombre} onChange={handleChange} error={errors.nombre} required />
            <Input label="Calle" name="calle" value={formData.calle} onChange={handleChange} />
            <Input label="Número" name="numero" value={formData.numero} onChange={handleChange} />
            <Input label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} />
            <Input label="Correo" name="correo" type="email" value={formData.correo} onChange={handleChange} />
            
            <Select 
              label="Provincia" 
              name="provincia" 
              value={formData.provincia} 
              onChange={handleChange} 
              options={mockProvincias} 
              error={errors.provincia}
              required 
            />
            <Select 
              label="Municipio" 
              name="municipio" 
              value={formData.municipio} 
              onChange={handleChange} 
              options={formData.provincia ? mockMunicipios[formData.provincia as keyof typeof mockMunicipios] || [] : []} 
              disabled={!formData.provincia}
              error={errors.municipio}
              required 
            />
            <Select 
              label="DPS/DAS" 
              name="dpsDas" 
              value={formData.dpsDas} 
              onChange={handleChange} 
              options={mockDPS_DAS} 
              error={errors.dpsDas}
              required 
            />
          </div>
        </div>

        {/* Sección: Geolocalización */}
        <GeoLocationPicker onLocationDetected={setLocationData} />

        {/* Sección: Clasificación y Operaciones */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Clasificación y Operaciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select 
              label="Comercialización" 
              name="comercializacion" 
              value={formData.comercializacion} 
              onChange={handleChange} 
              options={mockComercializacion} 
              error={errors.comercializacion}
              required 
            />
            <Select 
              label="Mercado Objetivo" 
              name="mercadoObjetivo" 
              value={formData.mercadoObjetivo} 
              onChange={handleChange} 
              options={mockMercadoObjetivo} 
              error={errors.mercadoObjetivo}
              required 
            />
            <Select 
              label="Categoría de Alimento" 
              name="categoriaAlimento" 
              value={formData.categoriaAlimento} 
              onChange={handleChange} 
              options={mockCategoriasAlimentos} 
              error={errors.categoriaAlimento}
              required 
            />
            <Select 
              label="Subcategoría de Alimento" 
              name="subcategoriaAlimento" 
              value={formData.subcategoriaAlimento} 
              onChange={handleChange} 
              options={formData.categoriaAlimento ? mockSubcategoriasAlimentos[formData.categoriaAlimento as keyof typeof mockSubcategoriasAlimentos] || [] : []} 
              disabled={!formData.categoriaAlimento}
              error={errors.subcategoriaAlimento}
              required 
            />
          </div>
        </div>

        {/* Sección: Preguntas Condicionales (HACCP, Muestreo, INABIE) */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Control Sanitario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select 
              label="¿Tienen implementado el sistema HACCP?" 
              name="haccp" 
              value={formData.haccp} 
              onChange={handleChange} 
              options={[{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]} 
            />
            <Select 
              label="Nivel de implementación" 
              name="nivelImplementacionHaccp" 
              value={formData.nivelImplementacionHaccp} 
              onChange={handleChange} 
              options={[
                { value: '25', label: '25%' },
                { value: '75', label: '75%' },
                { value: '100', label: 'Todas las líneas' },
              ]} 
              disabled={formData.haccp !== 'si'}
              className={formData.haccp !== 'si' ? 'opacity-50' : ''}
              error={errors.nivelImplementacionHaccp}
              required={formData.haccp === 'si'}
            />

            <Select 
              label="¿Tienen un plan de muestreo microbiológico?" 
              name="planMuestreo" 
              value={formData.planMuestreo} 
              onChange={handleChange} 
              options={[{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]} 
            />
            <Select 
              label="¿Dónde lo aplican?" 
              name="dondeAplicanMuestreo" 
              value={formData.dondeAplicanMuestreo} 
              onChange={handleChange} 
              options={[
                { value: 'materias_primas', label: 'Materias primas' },
                { value: 'areas_proceso_producto', label: 'Áreas de proceso y productos terminados' },
                { value: 'ambos', label: 'Ambos' },
              ]} 
              disabled={formData.planMuestreo !== 'si'}
              className={formData.planMuestreo !== 'si' ? 'opacity-50' : ''}
              error={errors.dondeAplicanMuestreo}
              required={formData.planMuestreo === 'si'}
            />

            <Select 
              label="¿Son suplidores del INABIE?" 
              name="inabie" 
              value={formData.inabie} 
              onChange={handleChange} 
              options={[{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]} 
            />
            <Select 
              label="¿Cómo lo distribuyen?" 
              name="comoDistribuyenInabie" 
              value={formData.comoDistribuyenInabie} 
              onChange={handleChange} 
              options={[
                { value: 'local', label: 'Local' },
                { value: 'regional', label: 'Regional' },
                { value: 'nacional', label: 'Nacional' },
              ]} 
              disabled={formData.inabie !== 'si'}
              className={formData.inabie !== 'si' ? 'opacity-50' : ''}
              error={errors.comoDistribuyenInabie}
              required={formData.inabie === 'si'}
            />
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Guardar Establecimiento
          </Button>
        </div>
      </form>
    </div>
  );
};
