import React from 'react';

interface OfflineBannerProps {
  isOffline: boolean;
  pendingSyncCount?: number;
  lastSyncTime?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ 
  isOffline, 
  pendingSyncCount = 0,
  lastSyncTime
}) => {
  if (!isOffline) return null;

  return (
    <div className="bg-yellow-100 border-b border-yellow-500 p-2 fixed top-0 w-full z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-yellow-800 text-sm font-medium">
          <svg className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
          Trabajando sin conexión
        </div>
        <div className="text-xs text-yellow-700 hidden sm:block">
          {pendingSyncCount > 0 && <span className="mr-3 font-semibold">{pendingSyncCount} operaciones encoladas</span>}
          {lastSyncTime && <span>Última sincronización: {lastSyncTime}</span>}
        </div>
      </div>
    </div>
  );
};
