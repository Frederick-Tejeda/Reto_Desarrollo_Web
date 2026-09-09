import React, { useState, useEffect } from 'react';
import { MetricCard } from '../../../Components/UI/MetricCard';
import { Button } from '../../../Components/UI/Button';

export const DashboardEmpresa: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Empresa</h2>
          <p className="text-sm text-gray-500">Resumen de solicitudes y evaluaciones de sus establecimientos.</p>
        </div>
        <Button onClick={() => window.location.href = '/solicitudes/nueva'}>
          Nueva Solicitud BPM
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Borradores de Solicitud" 
          value="2" 
          period="Actual"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/solicitudes?estado=borrador"
          isLoading={isLoading}
        />
        <MetricCard 
          title="Solicitudes Pendientes" 
          value="1" 
          period="Actual"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/solicitudes?estado=pendiente"
          isLoading={isLoading}
        />
        <MetricCard 
          title="Evaluaciones en Curso" 
          value="3" 
          period="Últimos 30 días"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/evaluaciones?estado=en_curso"
          isLoading={isLoading}
        />
        <MetricCard 
          title="Correcciones Requeridas" 
          value="1" 
          period="Actual"
          lastUpdate={new Date().toLocaleDateString()}
          trend="up"
          trendValue="Urgente"
          linkHref="/correcciones"
          isLoading={isLoading}
        />
        <MetricCard 
          title="Informes Emitidos" 
          value="12" 
          period="Año actual"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/informes"
          isLoading={isLoading}
        />
        <MetricCard 
          title="Notificaciones sin leer" 
          value="5" 
          period="Últimos 7 días"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/notificaciones"
          isLoading={isLoading}
        />
      </div>
      
      {/* Empty state simulation for some section */}
      {!isLoading && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Próximas Inspecciones</h3>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay inspecciones programadas</h3>
            <p className="mt-1 text-sm text-gray-500">Sus establecimientos están al día con las evaluaciones requeridas.</p>
          </div>
        </div>
      )}
    </div>
  );
};
