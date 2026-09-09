import React, { useState } from 'react';
import { DashboardEmpresa } from './DashboardEmpresa';
import { DashboardCoordinador } from './DashboardCoordinador';
import { DashboardTecnico } from './DashboardTecnico';
import { DashboardAdministrador } from './DashboardAdministrador';
import { Select } from '../../../Components/UI/Select';

type Role = 'EMPRESA' | 'COORDINADOR' | 'TECNICO' | 'ADMINISTRADOR';

const Dashboard: React.FC = () => {
  // Estado temporal para simular el rol del usuario logueado
  const [currentRole, setCurrentRole] = useState<Role>('EMPRESA');

  const renderDashboard = () => {
    switch (currentRole) {
      case 'EMPRESA':
        return <DashboardEmpresa />;
      case 'COORDINADOR':
        return <DashboardCoordinador />;
      case 'TECNICO':
        return <DashboardTecnico />;
      case 'ADMINISTRADOR':
        return <DashboardAdministrador />;
      default:
        return <div>Rol no reconocido</div>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Selector temporal para propósitos de demostración/desarrollo */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Modo de Desarrollo: Simulación de Rol</h3>
        <Select 
          label="" 
          name="roleSelector" 
          value={currentRole} 
          onChange={(e) => setCurrentRole(e.target.value as Role)}
          options={[
            { value: 'EMPRESA', label: 'Administrador de Empresa' },
            { value: 'COORDINADOR', label: 'Coordinador' },
            { value: 'TECNICO', label: 'Técnico Evaluador' },
            { value: 'ADMINISTRADOR', label: 'Administrador del Sistema' },
          ]}
          className="max-w-xs mb-0"
        />
      </div>

      {renderDashboard()}
    </div>
  );
};

export default Dashboard;