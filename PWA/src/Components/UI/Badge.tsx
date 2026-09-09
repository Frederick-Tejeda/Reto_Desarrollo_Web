import React from 'react';

export type UserStatus = 'PENDIENTE_VALIDACION' | 'ACTIVO' | 'RECHAZADO' | 'SUSPENDIDO' | 'DESACTIVADO' | 'BLOQUEADO';

interface BadgeProps {
  status: UserStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const statusStyles: Record<UserStatus, string> = {
    PENDIENTE_VALIDACION: 'bg-yellow-100 text-yellow-800 border-yellow-500',
    ACTIVO: 'bg-green-100 text-green-800 border-green-500',
    RECHAZADO: 'bg-red-100 text-red-800 border-red-500',
    SUSPENDIDO: 'bg-yellow-100 text-yellow-800 border-yellow-500',
    DESACTIVADO: 'bg-gray-100 text-gray-800 border-gray-500',
    BLOQUEADO: 'bg-red-100 text-red-800 border-red-500'
  };

  const statusLabels: Record<UserStatus, string> = {
    PENDIENTE_VALIDACION: 'Pendiente',
    ACTIVO: 'Activo',
    RECHAZADO: 'Rechazado',
    SUSPENDIDO: 'Suspendido',
    DESACTIVADO: 'Desactivado',
    BLOQUEADO: 'Bloqueado'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]} ${className}`}>
      {statusLabels[status]}
    </span>
  );
};
