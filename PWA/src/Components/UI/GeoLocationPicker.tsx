import React, { useState } from 'react';
import { Button } from './Button';
import { Alert } from './Alert';

interface GeoLocationData {
  latitud: number;
  longitud: number;
  precision: number;
  fecha: string;
}

interface GeoLocationPickerProps {
  onLocationDetected: (data: GeoLocationData) => void;
  initialLocation?: GeoLocationData;
}

export const GeoLocationPicker: React.FC<GeoLocationPickerProps> = ({ 
  onLocationDetected,
  initialLocation
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeoLocationData | null>(initialLocation || null);

  const requestLocation = () => {
    setError(null);
    setIsLoading(true);

    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por su navegador.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data: GeoLocationData = {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          precision: position.coords.accuracy,
          fecha: new Date(position.timestamp).toISOString()
        };
        setLocation(data);
        onLocationDetected(data);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso denegado. Puede continuar sin ubicación o habilitarla en su navegador.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Información de ubicación no disponible. Intente nuevamente.');
            break;
          case err.TIMEOUT:
            setError('La solicitud de ubicación expiró.');
            break;
          default:
            setError('Ocurrió un error desconocido al obtener la ubicación.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Ubicación del Establecimiento</h3>
      
      {location ? (
        <div className="mb-3 text-sm text-gray-600 bg-white p-3 rounded border">
          <p><strong>Latitud:</strong> {location.latitud.toFixed(6)}</p>
          <p><strong>Longitud:</strong> {location.longitud.toFixed(6)}</p>
          <p className="text-xs text-gray-400 mt-1">Precisión: {Math.round(location.precision)}m</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-3">La ubicación es opcional pero recomendada para el trabajo de campo.</p>
      )}

      {error && (
        <Alert type="warning" className="mb-3">
          {error}
        </Alert>
      )}

      <Button 
        type="button" 
        variant="outline" 
        onClick={requestLocation} 
        isLoading={isLoading}
      >
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        {location ? 'Actualizar mi ubicación actual' : 'Usar mi ubicación actual'}
      </Button>
    </div>
  );
};
