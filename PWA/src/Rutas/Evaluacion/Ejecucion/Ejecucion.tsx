import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';
import { Tabs } from '../../../Components/UI/Tabs';
import { DragDropUpload } from '../../../Components/UI/DragDropUpload';

// Secciones de ejemplo
const SECTIONS = [
  { id: 'infra', label: 'Infraestructura', weight: 40 },
  { id: 'higiene', label: 'Higiene y Sanitización', weight: 40 },
  { id: 'docs', label: 'Documentación', weight: 20 },
];

export const Ejecucion: React.FC = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'PAUSADA' | 'FINALIZADA'>('PENDIENTE');
  const [isOffline, setIsOffline] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  
  // Progreso
  const [progresoGlobal, setProgresoGlobal] = useState(0);
  const [activeTab, setActiveTab] = useState('infra');

  // Metadatos de sesión (RF-12.3)
  const [metadata, setMetadata] = useState<any>(null);

  // Auto-guardado local simulado
  useEffect(() => {
    if (estado === 'EN_CURSO') {
      setShowSaveAlert(true);
      const t = setTimeout(() => setShowSaveAlert(false), 2000);
      return () => clearTimeout(t);
    }
  }, [progresoGlobal, estado]);

  const handleIniciar = () => {
    // Simular registro de metadatos RF-12.3
    setMetadata({
      usuario: 'Técnico Pérez (TEC-001)',
      dispositivo: navigator.userAgent,
      fechaHora: new Date().toISOString(),
      ubicacion: 'Lat: 18.4861, Lng: -69.9312'
    });
    setEstado('EN_CURSO');
  };

  const simularRespuesta = () => {
    if (progresoGlobal < 100) setProgresoGlobal(p => Math.min(p + 15, 100));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pb-24">
      {/* HEADER Y ACCIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ejecución de Evaluación (RF-12)</h1>
          <p className="text-sm text-gray-500">Caso: CASO-2023-010 | Lácteos Dominicanos SA</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {estado === 'PENDIENTE' && (
            <Button onClick={handleIniciar}>Iniciar Inspección</Button>
          )}
          {estado === 'EN_CURSO' && (
            <>
              <Button onClick={() => setEstado('PAUSADA')} variant="outline">Pausar</Button>
              <Button onClick={() => alert('Validando campos...')} variant="secondary">Validar</Button>
              <Button onClick={() => setEstado('FINALIZADA')}>Finalizar</Button>
            </>
          )}
          {estado === 'PAUSADA' && (
            <Button onClick={() => setEstado('EN_CURSO')}>Continuar</Button>
          )}
          {estado === 'FINALIZADA' && (
            <Button onClick={() => {
              alert("Evaluación enviada a revisión formal (RF-12.6).");
              navigate('/agenda');
            }}>Enviar a Revisión</Button>
          )}
        </div>
      </div>

      {/* METADATOS Y CONEXIÓN */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 bg-white p-4 rounded shadow border border-gray-100 text-sm">
          <div className="flex justify-between mb-2">
            <strong>Estado de conexión:</strong>
            <button onClick={() => setIsOffline(!isOffline)} className={`font-bold ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
              {isOffline ? 'OFFLINE' : 'ONLINE'} (Cambiar)
            </button>
          </div>
          {isOffline && (
            <p className="text-gray-500 text-xs italic">Modo Offline activo. El guardado local es inmediato (RF-12.5).</p>
          )}
          {showSaveAlert && isOffline && (
            <span className="text-green-600 font-bold text-xs">¡Guardado localmente en dispositivo!</span>
          )}
        </div>
        
        {metadata && (
          <div className="flex-1 bg-blue-50 p-4 rounded shadow border border-blue-100 text-xs text-gray-700">
            <h4 className="font-bold text-blue-900 mb-1">Registro de Inicio (RF-12.3)</h4>
            <ul className="list-disc pl-4">
              <li><strong>Usuario:</strong> {metadata.usuario}</li>
              <li><strong>Fecha/Hora:</strong> {new Date(metadata.fechaHora).toLocaleString()}</li>
              <li><strong>Ubicación Inicial:</strong> {metadata.ubicacion}</li>
            </ul>
          </div>
        )}
      </div>

      {/* PANEL DE PROGRESO Y NAVEGACIÓN */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-bold">Progreso Global</span>
              <span>{progresoGlobal}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progresoGlobal}%` }}></div>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="text-center"><span className="block font-bold text-red-600">2</span> Errores/NC</div>
            <div className="text-center"><span className="block font-bold text-yellow-600">1</span> Evidencias faltantes</div>
          </div>
        </div>
        
        <Tabs
          tabs={SECTIONS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        
        <div className="p-4 min-h-[300px]">
          {estado === 'PENDIENTE' ? (
            <div className="text-center py-10 text-gray-500">
              Presione "Iniciar Inspección" para desbloquear la ficha (RF-12.2).
            </div>
          ) : (
            <div className="space-y-6 opacity-100 transition-opacity">
              <Alert type="info" title={`Sección: ${SECTIONS.find(s => s.id === activeTab)?.label}`}>
                A medida que responda, se ejecutará el autoguardado (RF-12.5).
              </Alert>

              <div className="bg-gray-50 p-4 rounded border">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  ¿Las instalaciones cumplen con los estándares de limpieza mínimos?
                </label>
                <div className="flex gap-4 mb-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="p1" className="form-radio" onChange={simularRespuesta} disabled={estado !== 'EN_CURSO'} />
                    <span className="ml-2">Sí, cumple</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="p1" className="form-radio text-red-600" onChange={simularRespuesta} disabled={estado !== 'EN_CURSO'} />
                    <span className="ml-2">No cumple (Crear NC)</span>
                  </label>
                </div>
                
                <label className="block text-sm font-medium text-gray-900 mb-2 mt-4">Evidencia Fotográfica (Obligatorio en No Conformidad)</label>
                <DragDropUpload 
                  id="evidencia-1" 
                  accept="image/*" 
                  maxSizeMB={5}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};