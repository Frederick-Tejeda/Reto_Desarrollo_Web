import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { mockInformes } from './ListadoInformes';

export const VisorInforme: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const informe = mockInformes.find(inf => inf.id === id);

  useEffect(() => {
    if (!informe && id) {
      // Intenta encontrarlo incluso si es una versión recién creada (simplificación para el mock)
      // En un entorno real, haría un fetch al backend.
    }
  }, [id, informe]);

  if (!informe) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-gray-700">Informe no encontrado</h2>
        <Button onClick={() => navigate('/informes')} className="mt-4">Volver al listado</Button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    // Simula una petición al backend para generar y devolver el blob del PDF (RF-16.5)
    setTimeout(() => {
      setIsDownloading(false);
      alert("Simulación: Descarga del archivo PDF oficial recibida desde el backend.");
    }, 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-24">
      {/* Botonera superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visor de Informe (RF-16)</h1>
          <p className="text-sm text-gray-500">Vista HTML Accesible</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/informes')}>Volver</Button>
          <Button 
            onClick={handleDownloadPDF} 
            isLoading={isDownloading}
            disabled={informe.estado === 'BORRADOR'}
          >
            Descargar PDF Oficial
          </Button>
        </div>
      </div>

      {/* Contenedor del Informe HTML */}
      <div className="relative bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden min-h-[800px]">
        {/* Marca de Agua (Borrador) */}
        {informe.estado === 'BORRADOR' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
            <div className="transform -rotate-45 text-[150px] font-black text-gray-300 opacity-20 whitespace-nowrap">
              BORRADOR
            </div>
          </div>
        )}

        <div className="relative z-10 p-8 md:p-12 text-gray-800">
          {/* Portada */}
          <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
            <h1 className="text-3xl font-black uppercase tracking-wider mb-2">Informe de Evaluación</h1>
            <h2 className="text-xl text-gray-600 mb-6">{informe.empresa}</h2>
            <div className="flex justify-between text-sm font-bold text-gray-500">
              <span>Nº: {informe.id}</span>
              <span>Versión: {informe.version}.0</span>
              <span>Fecha: {informe.fecha}</span>
            </div>
          </div>

          {/* Datos Generales */}
          <div className="mb-8">
            <h3 className="text-lg font-bold border-b border-gray-300 mb-3 pb-1">1. Datos Generales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Establecimiento:</strong> {informe.establecimiento}</p>
              <p><strong>Caso Origen:</strong> {informe.casoId}</p>
              <p><strong>Emisor:</strong> {informe.emisor}</p>
              <p><strong>Estado del Documento:</strong> {informe.estado}</p>
            </div>
          </div>

          {/* Resumen Ejecutivo y Calificación */}
          <div className="mb-8 bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-bold border-b border-gray-300 mb-3 pb-1">2. Resumen Ejecutivo</h3>
            <p className="text-sm mb-4">
              La inspección realizada determinó que el establecimiento cumple parcialmente con las normativas sanitarias vigentes. Se encontraron áreas de mejora en infraestructura y documentación.
            </p>
            <div className="flex gap-8">
              <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase font-bold">Calificación Total</span>
                <span className={`text-3xl font-black ${informe.calificacion >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {informe.calificacion}/100
                </span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase font-bold">Nivel de Riesgo</span>
                <span className={`text-2xl font-black mt-1 ${informe.riesgo === 'ALTO' ? 'text-red-600' : (informe.riesgo === 'MEDIO' ? 'text-yellow-600' : 'text-green-600')}`}>
                  {informe.riesgo}
                </span>
              </div>
            </div>
          </div>

          {/* Hallazgos y No Conformidades */}
          <div className="mb-8">
            <h3 className="text-lg font-bold border-b border-gray-300 mb-3 pb-1">3. Hallazgos y No Conformidades (NC)</h3>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>
                <strong>NC-01 (Infraestructura):</strong> Grietas observadas en el piso del almacén principal. 
                <em className="block text-gray-500 mt-1">Evidencia adjunta (FOTO-01.jpg) en el repositorio documental oficial.</em>
              </li>
              <li>
                <strong>Hallazgo:</strong> Ausencia parcial de registros de control de temperatura de la semana pasada.
              </li>
            </ul>
          </div>

          {/* Integridad (Solo si está emitido) */}
          {informe.estado === 'EMITIDO' && informe.hash && (
            <div className="mt-16 pt-6 border-t-2 border-gray-800 text-xs text-gray-400 text-center">
              <p>Este es un documento oficial emitido por el sistema.</p>
              <p className="font-mono mt-1">Hash de Integridad (RF-16.3): {informe.hash}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
