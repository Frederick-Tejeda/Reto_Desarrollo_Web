import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';
import { mockRevisiones } from './ListadoRevisiones';
import { ModalSolicitarCorreccion } from './ModalSolicitarCorreccion';

export const RevisarEvaluacion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const evaluacion = mockRevisiones.find(e => e.id === id);

  if (!evaluacion) {
    return <div className="p-10 text-center">Evaluación no encontrada.</div>;
  }

  const handleAprobar = () => {
    const comentario = prompt("Comentario opcional de aprobación (RF-17.3):");
    // Simulando registro de decisión (RF-17.5)
    alert(`Evaluación APROBADA por Coordinador.\nFecha: ${new Date().toLocaleString()}\nComentario: ${comentario || 'Ninguno'}`);
    navigate('/revision_y_cierre');
  };

  const handleCorreccionGuardada = (comentario: string, secciones: string[]) => {
    setShowModal(false);
    alert(`Solicitud de corrección enviada.\nMotivo: ${comentario}\nSecciones Habilitadas: ${secciones.join(', ')}\n(RF-17.5 y 17.4 cumplidos)`);
    navigate('/revision_y_cierre');
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revisar Evaluación (RF-17)</h1>
          <p className="text-sm text-gray-500">{evaluacion.id} | {evaluacion.empresa}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/revision_y_cierre')}>Cancelar</Button>
          <Button variant="danger" onClick={() => setShowModal(true)}>Solicitar Corrección</Button>
          <Button variant="primary" onClick={handleAprobar}>Aprobar (Validar y Cerrar)</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Principal: Comparación y Detalles (RF-17.2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Resumen de la Evaluación</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-gray-500 uppercase text-xs font-bold mb-1">Calificación</span>
                <span className="text-2xl font-black text-green-600">92/100</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-gray-500 uppercase text-xs font-bold mb-1">Nivel de Riesgo Calculado</span>
                <span className="text-2xl font-black text-yellow-600">MEDIO</span>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-2">Hallazgos y No Conformidades (NC)</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2 mb-6">
              <li><strong>Infraestructura:</strong> Faltan señalamientos de salida de emergencia (NC Menor).</li>
              <li><strong>Higiene:</strong> Dispensador de jabón vacío en baño de empleados.</li>
            </ul>

            <h3 className="font-bold text-gray-800 mb-2">Evidencias Faltantes</h3>
            <p className="text-sm text-gray-700 mb-6 italic">No se reportan evidencias fotográficas faltantes.</p>
            
            <h3 className="font-bold text-gray-800 mb-2">Campos Editados Recientemente</h3>
            <p className="text-sm text-gray-700">El técnico no realizó ediciones posteriores al primer guardado.</p>
          </div>
        </div>

        {/* Panel Lateral: Alertas de Consistencia (RF-17.2) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Análisis Automático</h2>
          
          <Alert type="warning" title="Consistencia de Riesgo">
            El sistema detecta que la calificación es alta (92/100), pero existe una No Conformidad en Higiene que podría requerir elevar el riesgo a ALTO según reglas de negocio. Por favor, verifique.
          </Alert>

          <Alert type="info" title="Auditoría">
            El técnico finalizó esta evaluación offline y se sincronizó el {evaluacion.fechaEnvio}. Las ubicaciones GPS coinciden con la dirección de la empresa.
          </Alert>

          <div className="bg-white shadow rounded-lg p-4 border border-gray-200 mt-4 text-xs text-gray-500">
            <p className="font-bold text-gray-700 mb-1">Información de Sistema</p>
            <p>Técnico: {evaluacion.tecnico}</p>
            <p>ID Evaluación: {evaluacion.id}</p>
            <p>Estado de Envío: Bloqueado para el técnico (RF-17.4)</p>
          </div>
        </div>
      </div>

      {showModal && (
        <ModalSolicitarCorreccion 
          titulo={`Devolver: ${evaluacion.id}`}
          onClose={() => setShowModal(false)}
          onSubmit={handleCorreccionGuardada}
        />
      )}
    </div>
  );
};
