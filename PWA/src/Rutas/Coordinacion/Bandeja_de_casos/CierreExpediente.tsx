import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';

export const CierreExpediente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estados para simular el ciclo de vida del cierre (RF-19)
  const [estadoCierre, setEstadoCierre] = useState<'ABIERTO' | 'CERRADO'>('ABIERTO');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showOverride, setShowOverride] = useState(false);

  // Datos mockeados del expediente
  const expediente = {
    id: id || 'CASO-2023-010',
    empresa: 'Lácteos Dominicanos SA',
    informeId: 'INF-2023-010-v2',
    riesgo: 'ALTO',
    fechaEmision: '2023-11-10',
    // Simulamos que existe un bloqueo por defecto para probar el RF-19.3
    bloqueos: [
      'Existe una No Conformidad Crítica (Infraestructura) sin resolución.',
      'Falta evidencia fotográfica obligatoria en el ítem 2.3.'
    ],
    hashIntegridad: 'a8f5f167f44f4964e6c998dee827110c'
  };

  // Cálculo de Próxima Inspección (RF-19.2)
  const calcularProximaInspeccion = (riesgo: string) => {
    const meses = riesgo === 'ALTO' ? 6 : (riesgo === 'MEDIO' ? 12 : 24);
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + meses);
    return {
      meses,
      fechaStr: fecha.toLocaleDateString()
    };
  };

  const proximaInspeccion = calcularProximaInspeccion(expediente.riesgo);
  const tieneBloqueos = expediente.bloqueos.length > 0;

  const handleDescargarPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Simulación: Descarga del archivo PDF del expediente recibida desde el servidor (RF-19.5).");
    }, 1500);
  };

  const handleConsultarIntegridad = () => {
    alert(`Consulta de Integridad (RF-19.5)\n\nHash SHA-256 del Informe Emitido:\n${expediente.hashIntegridad}\n\nEl documento no ha sido alterado desde su emisión original.`);
  };

  const procesarCierre = (excepcionMotivo?: string) => {
    setEstadoCierre('CERRADO');
    let mensaje = `Expediente ${expediente.id} ha sido CERRADO exitosamente.\nPróxima inspección agendada para: ${proximaInspeccion.fechaStr}.\nEstado: Inmutable (RF-19.4).`;
    if (excepcionMotivo) {
      mensaje += `\n\nCierre forzado bajo excepción: "${excepcionMotivo}"`;
    }
    alert(mensaje);
  };

  const handleCerrarExpediente = () => {
    if (tieneBloqueos) return; // Protegido por UI de todas formas
    procesarCierre();
  };

  const handleForzarCierre = () => {
    const clave = prompt("Permiso Reforzado (RF-19.3)\nIngrese clave de Supervisor para saltar bloqueos críticos:");
    if (clave === 'admin123' || clave === '1234') { // Mock simple
      const motivo = prompt("Ingrese el motivo legal o justificación para la excepción:");
      if (motivo && motivo.trim().length > 5) {
        procesarCierre(motivo);
        setShowOverride(false);
      } else {
        alert("Motivo inválido. El cierre ha sido cancelado.");
      }
    } else {
      alert("Clave incorrecta. Acceso denegado.");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emisión y Cierre de Expediente (RF-19)</h1>
          <p className="text-sm text-gray-500">Decisión Final e Inmutabilidad</p>
        </div>
        <div className="flex items-center gap-2">
          {estadoCierre === 'CERRADO' && (
            <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-xs font-bold mr-2 tracking-widest">
              EXPEDIENTE CERRADO E INMUTABLE
            </span>
          )}
          <Button variant="outline" onClick={() => navigate('/bandeja_de_casos')}>Volver a Bandeja</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Datos del Expediente */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Resumen del Expediente</h2>
            <div className="grid grid-cols-2 gap-4 text-sm mb-6 text-gray-700">
              <p><strong>Caso ID:</strong> {expediente.id}</p>
              <p><strong>Empresa:</strong> {expediente.empresa}</p>
              <p><strong>Informe Asociado:</strong> {expediente.informeId}</p>
              <p><strong>Fecha de Emisión:</strong> {expediente.fechaEmision}</p>
              <p><strong>Nivel de Riesgo Global:</strong> <span className="font-bold text-red-600">{expediente.riesgo}</span></p>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={handleDescargarPDF} isLoading={isDownloading}>
                Descargar PDF Original (RF-19.5)
              </Button>
              <Button variant="outline" onClick={handleConsultarIntegridad}>
                Consultar Integridad
              </Button>
            </div>
          </div>

          {/* Panel de Bloqueos (RF-19.3) */}
          {tieneBloqueos && estadoCierre === 'ABIERTO' && (
            <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded shadow-sm">
              <h3 className="text-red-800 font-bold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Bloqueos Detectados (Cierre Impedido)
              </h3>
              <ul className="list-disc pl-5 text-sm text-red-700 space-y-1 mb-4">
                {expediente.bloqueos.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              
              {!showOverride ? (
                <button 
                  onClick={() => setShowOverride(true)}
                  className="text-xs font-bold text-red-600 hover:text-red-800 underline transition-colors"
                >
                  Opciones avanzadas (Excepción / Permiso Reforzado)
                </button>
              ) : (
                <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">
                  <p className="text-xs text-red-800 mb-2 font-bold">
                    ATENCIÓN: Está a punto de saltarse las validaciones obligatorias del sistema (RF-19.3). 
                    Esta acción quedará estrictamente auditada a su nombre.
                  </p>
                  <Button variant="danger" onClick={handleForzarCierre} className="w-full">
                    Forzar Cierre con Permiso Reforzado
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha: Acciones de Cierre */}
        <div className="space-y-6">
          <div className={`shadow rounded-lg p-6 border ${estadoCierre === 'CERRADO' ? 'bg-gray-100 border-gray-300 opacity-75' : 'bg-white border-blue-200'}`}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Acción de Cierre</h2>
            
            <div className="mb-6 bg-blue-50 p-4 rounded text-sm text-blue-900 border border-blue-100">
              <strong className="block mb-1">Próxima Inspección (RF-19.2)</strong>
              <p>Basado en el riesgo {expediente.riesgo}, el sistema propone la próxima evaluación en <strong>{proximaInspeccion.meses} meses</strong>.</p>
              <p className="text-lg font-black mt-2 text-center">{proximaInspeccion.fechaStr}</p>
            </div>

            <Button 
              variant="primary" 
              className="w-full h-12 text-lg"
              disabled={estadoCierre === 'CERRADO' || tieneBloqueos}
              onClick={handleCerrarExpediente}
            >
              {estadoCierre === 'CERRADO' ? 'Expediente Sellado' : 'Cerrar Expediente'}
            </Button>

            {estadoCierre === 'ABIERTO' && tieneBloqueos && (
              <p className="text-xs text-red-600 mt-2 text-center font-bold">
                Resuelva los bloqueos para habilitar este botón.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
