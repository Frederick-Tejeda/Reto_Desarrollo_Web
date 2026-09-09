import React, { useState, useEffect } from 'react';
import { MetricCard } from '../../../Components/UI/MetricCard';
import { Button } from '../../../Components/UI/Button';

export const DashboardTecnico: React.FC = () => {
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
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Técnico</h2>
          <p className="text-sm text-gray-500">Gestión de trabajo de campo y sincronización.</p>
        </div>
        <Button onClick={() => window.location.href = '/sincronizacion'} variant="outline">
          Centro de Sincronización
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard 
          title="Evaluaciones Asignadas" 
          value="8" 
          period="Semana actual"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/agenda"
          isLoading={isLoading}
        />
        <MetricCard 
          title="Trabajo Descargado (Offline)" 
          value="3" 
          period="Actual"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/descarga_offline"
          isLoading={isLoading}
        />
        <MetricCard 
          title="Borradores Offline" 
          value="2" 
          period="Actual"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/ejecucion"
          isOffline={true}
          isLoading={isLoading}
        />
        <MetricCard 
          title="Sincronización Pendiente" 
          value="5" 
          period="Operaciones"
          trend="up"
          trendValue="Requiere red"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/sincronizacion"
          isLoading={isLoading}
        />
        <MetricCard 
          title="Informes Devueltos" 
          value="1" 
          period="Mes actual"
          trend="down"
          trendValue="Atención requerida"
          lastUpdate={new Date().toLocaleDateString()}
          linkHref="/agenda"
          isLoading={isLoading}
        />
      </div>

      {!isLoading && (
        <div className="mt-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Sincronización Pendiente</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Tiene 5 operaciones pendientes de sincronizar con el servidor. Conéctese a una red y acceda al centro de sincronización.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
