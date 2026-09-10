import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';

// Mock Interfaces para la estructura jerárquica (RF-21.5 y 21.3)
type ItemType = 'SECCION' | 'SUBSECCION' | 'GRUPO' | 'PREGUNTA' | 'TEXTO_INFORMATIVO';
type AnswerType = 'OPCION_UNICA' | 'TEXTO_CORTO' | 'SI_NO' | 'EVIDENCIA';

interface FichaItem {
  id: string;
  tipo: ItemType;
  titulo: string;
  tipoRespuesta?: AnswerType;
  puntaje?: number;
  peso?: number;
  obligatorio?: boolean;
  requiereEvidencia?: boolean;
}

export const EditorFicha: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estado que representa el árbol jerárquico (RF-21.9)
  const [items, setItems] = useState<FichaItem[]>([
    { id: 'item-1', tipo: 'SECCION', titulo: '1. Condiciones de Higiene' },
    { id: 'item-2', tipo: 'PREGUNTA', titulo: '1.1 ¿Las superficies están limpias?', tipoRespuesta: 'SI_NO', puntaje: 10, peso: 1, obligatorio: true, requiereEvidencia: true },
    { id: 'item-3', tipo: 'PREGUNTA', titulo: '1.2 Temperatura registrada', tipoRespuesta: 'TEXTO_CORTO', puntaje: 5, peso: 1, obligatorio: false }
  ]);

  const [selectedItemId, setSelectedItemId] = useState<string>('item-2');
  const [vistaMovil, setVistaMovil] = useState(false);

  const selectedItem = items.find(i => i.id === selectedItemId);

  const handleValidarYPublicar = () => {
    // Simulación de validación estructural (RF-21.7)
    alert("Ejecutando Validación Estructural...\n\n✅ Al menos un ítem evaluable detectado.\n✅ Códigos únicos verificados.\n✅ Sin dependencias cíclicas.\n\nLa ficha está lista para publicarse.");
    alert(`Ficha ${id} PUBLICADA exitosamente. Ahora es inmutable (RF-21.8).`);
    navigate('/fichas');
  };

  const handleUpdateItem = (key: keyof FichaItem, value: any) => {
    setItems(prev => prev.map(item => item.id === selectedItemId ? { ...item, [key]: value } : item));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-10 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center">
            <span className="text-blue-600 mr-2">Editor de Fichas</span> {id}
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-gray-200 rounded p-1 mr-4">
            <button 
              className={`px-3 py-1 text-xs font-bold rounded ${!vistaMovil ? 'bg-white shadow' : 'text-gray-500'}`}
              onClick={() => setVistaMovil(false)}
            >
              Escritorio
            </button>
            <button 
              className={`px-3 py-1 text-xs font-bold rounded ${vistaMovil ? 'bg-white shadow' : 'text-gray-500'}`}
              onClick={() => setVistaMovil(true)}
            >
              Móvil
            </button>
          </div>
          <Button variant="outline" onClick={() => navigate('/fichas')}>Guardar y Salir</Button>
          <Button variant="primary" onClick={handleValidarYPublicar}>Validar y Publicar</Button>
        </div>
      </div>

      {/* 3 Columns Layout (RF-21.9) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Columna Izquierda: Vista Árbol */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100 bg-gray-50 font-bold text-xs text-gray-500 uppercase">
            Estructura (Árbol)
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {items.map(item => (
              <div 
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`cursor-pointer p-2 rounded text-sm truncate flex items-center ${
                  selectedItemId === item.id ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2 text-gray-400 text-xs">
                  {item.tipo === 'SECCION' ? '📁' : '❓'}
                </span>
                {item.titulo}
              </div>
            ))}
            <button className="w-full mt-4 p-2 text-sm text-blue-600 font-bold border border-dashed border-blue-300 rounded hover:bg-blue-50">
              + Añadir Ítem
            </button>
          </div>
        </div>

        {/* Columna Central: Lienzo / Preview */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-gray-100">
          <div className={`transition-all duration-300 ${vistaMovil ? 'w-[375px]' : 'w-full max-w-3xl'}`}>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden min-h-[600px] border border-gray-200">
              {/* Header decorativo de la preview */}
              <div className="bg-blue-600 p-4 text-white">
                <h2 className="text-xl font-bold">Vista Previa de Evaluación</h2>
                <p className="text-xs opacity-80">Renderizado en tiempo real</p>
              </div>
              
              <div className="p-6 space-y-6">
                {items.map(item => (
                  <div key={item.id} className={`p-4 rounded border-2 transition-colors ${selectedItemId === item.id ? 'border-blue-400 bg-blue-50' : 'border-transparent hover:border-gray-200'}`} onClick={() => setSelectedItemId(item.id)}>
                    {item.tipo === 'SECCION' ? (
                      <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2">{item.titulo}</h3>
                    ) : (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {item.titulo} 
                          {item.obligatorio && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {item.tipoRespuesta === 'SI_NO' && (
                          <div className="flex gap-4">
                            <label className="inline-flex items-center"><input type="radio" name={item.id} className="form-radio text-blue-600" disabled /> <span className="ml-2 text-sm">Sí</span></label>
                            <label className="inline-flex items-center"><input type="radio" name={item.id} className="form-radio text-blue-600" disabled /> <span className="ml-2 text-sm">No</span></label>
                          </div>
                        )}
                        {item.tipoRespuesta === 'TEXTO_CORTO' && (
                          <input type="text" className="w-full border-gray-300 rounded border p-2 bg-gray-50" disabled placeholder="Respuesta..." />
                        )}
                        {item.requiereEvidencia && (
                          <div className="mt-3 p-3 border-2 border-dashed border-gray-300 rounded text-center text-xs text-gray-400">
                            📷 Adjuntar evidencia obligatoria
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Propiedades */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100 bg-gray-50 font-bold text-xs text-gray-500 uppercase">
            Propiedades (RF-21.6)
          </div>
          <div className="overflow-y-auto flex-1 p-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Tipo de Ítem (RF-21.3)</label>
                  <select 
                    className="w-full text-sm border-gray-300 border rounded p-2 bg-gray-50"
                    value={selectedItem.tipo}
                    onChange={(e) => handleUpdateItem('tipo', e.target.value)}
                  >
                    <option value="SECCION">SECCION</option>
                    <option value="SUBSECCION">SUBSECCION</option>
                    <option value="PREGUNTA">PREGUNTA</option>
                    <option value="TEXTO_INFORMATIVO">TEXTO_INFORMATIVO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Título / Enunciado</label>
                  <textarea 
                    className="w-full text-sm border-gray-300 border rounded p-2"
                    value={selectedItem.titulo}
                    onChange={(e) => handleUpdateItem('titulo', e.target.value)}
                    rows={3}
                  />
                </div>

                {selectedItem.tipo === 'PREGUNTA' && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Tipo de Respuesta (RF-21.4)</label>
                      <select 
                        className="w-full text-sm border-gray-300 border rounded p-2"
                        value={selectedItem.tipoRespuesta}
                        onChange={(e) => handleUpdateItem('tipoRespuesta', e.target.value)}
                      >
                        <option value="SI_NO">Sí / No</option>
                        <option value="OPCION_UNICA">Opción Única</option>
                        <option value="TEXTO_CORTO">Texto Corto</option>
                        <option value="EVIDENCIA">Archivo/Evidencia</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Puntaje</label>
                        <input type="number" className="w-full text-sm border-gray-300 border rounded p-2" value={selectedItem.puntaje} onChange={(e) => handleUpdateItem('puntaje', Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Peso</label>
                        <input type="number" className="w-full text-sm border-gray-300 border rounded p-2" value={selectedItem.peso} onChange={(e) => handleUpdateItem('peso', Number(e.target.value))} />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="flex items-center text-sm">
                        <input type="checkbox" className="form-checkbox rounded text-blue-600" checked={selectedItem.obligatorio} onChange={(e) => handleUpdateItem('obligatorio', e.target.checked)} />
                        <span className="ml-2 font-medium">Obligatorio</span>
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="checkbox" className="form-checkbox rounded text-blue-600" checked={selectedItem.requiereEvidencia} onChange={(e) => handleUpdateItem('requiereEvidencia', e.target.checked)} />
                        <span className="ml-2 font-medium">Requiere Evidencia Fotográfica</span>
                      </label>
                    </div>
                  </>
                )}
                
                <div className="mt-8">
                  <Button variant="danger" className="w-full text-xs">Eliminar Ítem Lógicamente</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center mt-10">Seleccione un ítem en el árbol o en el lienzo para ver sus propiedades.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
