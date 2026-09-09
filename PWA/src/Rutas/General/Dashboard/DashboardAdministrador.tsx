import React, { useState, useEffect } from 'react';
import { MetricCard } from '../../../Components/UI/MetricCard';

export const DashboardAdministrador: React.FC = () => {
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
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrador</h2>
          <p className="text-sm text-gray-500">Métricas globales y estado del sistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Usuarios Activos" value="1,204" period="Total" lastUpdate={new Date().toLocaleDateString()} linkHref="/usuarios" isLoading={isLoading} />
        <MetricCard title="Empresas Registradas" value="850" period="Total" lastUpdate={new Date().toLocaleDateString()} linkHref="/empresas" isLoading={isLoading} />
        <MetricCard title="Fichas Publicadas" value="15" period="Versiones activas" lastUpdate={new Date().toLocaleDateString()} linkHref="/fichas" isLoading={isLoading} />
        <MetricCard title="Fallos de Sincronización" value="23" period="Últimos 7 días" trend="down" trendValue="-5%" lastUpdate={new Date().toLocaleDateString()} linkHref="/salud_operativa_autorizada" isLoading={isLoading} />
        <MetricCard title="Uso Documental" value="1.2 TB" period="Almacenamiento total" trend="up" trendValue="+50GB" lastUpdate={new Date().toLocaleDateString()} linkHref="/auditoria" isLoading={isLoading} />
      </div>

      {!isLoading && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Resumen de Auditoría Reciente</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Últimos eventos críticos registrados en el sistema.</p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              <li className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">Nueva Ficha Publicada: BPM General v3</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Éxito
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Usuario: Admin01
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Hace 2 horas</p>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">Actualización de Reglas de Riesgo</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Éxito
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Usuario: SuperAdmin
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Ayer</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
