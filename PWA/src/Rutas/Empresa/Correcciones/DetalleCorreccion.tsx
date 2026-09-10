import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { DragDropUpload } from '../../../Components/UI/DragDropUpload';
import { mockCorrecciones } from './ListadoCorrecciones';

export const DetalleCorreccion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const correccionInicial = mockCorrecciones.find(c => c.id === id);
  const [estado, setEstado] = useState(correccionInicial?.estado || 'PENDIENTE');
  const [nuevoValor, setNuevoValor] = useState('');
  const [comentario, setComentario] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);

  if (!correccionInicial) {
    return <div className="p-10 text-center">Corrección no encontrada.</div>;
  }

  const isBloqueado = estado === 'ENVIADA' || estado === 'ACEPTADA' || estado === 'VENCIDA';

  const handleGuardarProgreso = () => {
    if (estado === 'PENDIENTE') setEstado('EN_PROCESO');
    alert("Progreso guardado localmente (RF-18.4)");
  };

  const handleEnviar = () => {
    if (!nuevoValor.trim() || archivos.length === 0) {
      alert("Debe ingresar un nuevo valor y adjuntar al menos una evidencia.");
      return;
    }
    setEstado('ENVIADA');
    alert("Corrección enviada al coordinador.\nEl expediente pasa a PENDIENTE_REVISION (RF-18.5).\nLa vista ahora es de Solo-Lectura.");
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pb-24">
      {/* Cabecera (RF-18.1) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atender Corrección (RF-18)</h1>
          <p className="text-sm text-gray-500">
            {correccionInicial.id} | Fecha Límite: <strong className={new Date(correccionInicial.fechaLimite) < new Date() ? 'text-red-600' : ''}>{correccionInicial.fechaLimite}</strong>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gray-200 text-gray-800`}>
            ESTADO: {estado.replace('_', ' ')}
          </span>
          <Button variant="outline" onClick={() => navigate('/correcciones')}>Volver</Button>
          {!isBloqueado && (
            <>
              <Button variant="secondary" onClick={handleGuardarProgreso}>Guardar Progreso</Button>
              <Button variant="primary" onClick={handleEnviar}>Enviar a Revisión</Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h3 className="font-bold text-blue-800">Observaciones del Coordinador:</h3>
        <p className="text-sm text-blue-700 mt-1">{correccionInicial.observaciones}</p>
        <p className="text-xs text-blue-600 mt-2 font-bold">Evidencia Solicitada: Obligatoria</p>
      </div>

      {/* Pantalla Dividida (RF-18.2 y 18.3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Panel Izquierdo: Valor Anterior (Bloqueado) */}
        <div className="bg-gray-50 shadow rounded-lg p-6 border border-gray-200 opacity-80">
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-300 pb-2 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Valor Anterior (Solo Lectura)
          </h2>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <label className="block font-bold mb-1">Sección:</label>
              <p className="bg-gray-200 p-2 rounded cursor-not-allowed">Infraestructura - 1.2 Rampas de acceso</p>
            </div>
            <div>
              <label className="block font-bold mb-1">Valor Registrado:</label>
              <p className="bg-gray-200 p-2 rounded cursor-not-allowed">"Rampa en mal estado, presenta grietas."</p>
            </div>
            <div>
              <label className="block font-bold mb-1">Evidencia Original:</label>
              <p className="bg-gray-200 p-2 rounded cursor-not-allowed text-blue-500 underline">foto_rampa_agosto.jpg</p>
            </div>
          </div>
          <div className="mt-6 text-xs text-gray-500 text-center">
            El resto de la evaluación permanece bloqueada y no es visible en esta pantalla (RF-18.2).
          </div>
        </div>

        {/* Panel Derecho: Nuevo Valor (Editable o Bloqueado según estado) */}
        <div className={`bg-white shadow rounded-lg p-6 border ${isBloqueado ? 'border-gray-200 opacity-90' : 'border-blue-300'}`}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Corrección
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nuevo Valor / Acción Tomada *</label>
              <textarea 
                className={`w-full border-gray-300 rounded-md shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${isBloqueado ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                rows={3}
                disabled={isBloqueado}
                value={nuevoValor}
                onChange={(e) => setNuevoValor(e.target.value)}
                placeholder="Describa la corrección realizada..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Comentario Adicional</label>
              <input 
                type="text"
                className={`w-full border-gray-300 rounded-md shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${isBloqueado ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={isBloqueado}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Comentarios para el coordinador (Opcional)..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Evidencia Fotográfica / Documental *</label>
              {isBloqueado ? (
                <div className="bg-gray-100 p-4 rounded text-center text-sm text-gray-500">
                  {archivos.length > 0 ? `${archivos.length} archivo(s) adjunto(s).` : 'Evidencia bloqueada para edición.'}
                </div>
              ) : (
                <DragDropUpload onFilesSelected={setArchivos} />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
