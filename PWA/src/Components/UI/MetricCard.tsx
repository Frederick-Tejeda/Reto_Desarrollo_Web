import React from 'react';
import { Skeleton } from './Skeleton';

interface MetricCardProps {
  title: string;
  value: string | number;
  period?: string;
  lastUpdate?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  linkText?: string;
  linkHref?: string;
  isLoading?: boolean;
  isOffline?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  period,
  lastUpdate,
  trend,
  trendValue,
  linkText = 'Ver detalle',
  linkHref = '#',
  isLoading = false,
  isOffline = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <Skeleton type="text" className="w-1/2 mb-4" />
        <Skeleton type="rectangular" className="h-10 mb-4" />
        <Skeleton type="text" className="w-1/3" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-5 relative overflow-hidden ${isOffline ? 'border-t-4 border-yellow-400' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <div className="mt-1 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {trend && trendValue && (
              <span className={`ml-2 text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div>
          {period && <p className="mb-1">Período: {period}</p>}
          {(lastUpdate || isOffline) && (
            <p className={isOffline ? 'text-yellow-600 font-medium' : ''}>
              {isOffline ? '⚠️ Offline - Última act: ' : 'Última act: '} 
              {lastUpdate || 'Desconocida'}
            </p>
          )}
        </div>
        
        {linkHref && (
          <a href={linkHref} className="text-blue-600 hover:text-blue-800 font-medium">
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
};
