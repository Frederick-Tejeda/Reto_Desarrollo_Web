import React, { useState, useEffect } from 'react';
import { MetricCard } from '../../../Components/UI/MetricCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export const DashboardCoordinador: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for charts
  const riskData = [
    { name: 'Riesgo Bajo', value: 400, color: '#10B981' }, // green-500
    { name: 'Riesgo Medio', value: 300, color: '#F59E0B' }, // yellow-500
    { name: 'Riesgo Alto', value: 100, color: '#EF4444' }, // red-500
  ];

  const techLoadData = [
    { name: 'Téc. Pérez', asignadas: 12, completadas: 8 },
    { name: 'Téc. Gómez', asignadas: 15, completadas: 5 },
    { name: 'Téc. Ruiz', asignadas: 8, completadas: 7 },
    { name: 'Téc. Santos', asignadas: 20, completadas: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Coordinador</h2>
          <p className="text-sm text-gray-500">Supervisión operativa y asignación de casos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Casos Pendientes" value="24" period="Actual" lastUpdate={new Date().toLocaleDateString()} linkHref="/bandeja_de_casos" isLoading={isLoading} />
        <MetricCard title="Alertas (LAPCH)" value="3" period="Últimos 7 días" trend="up" trendValue="+2" lastUpdate={new Date().toLocaleDateString()} linkHref="/alertas" isLoading={isLoading} />
        <MetricCard title="Denuncias Nuevas" value="5" period="Últimos 7 días" lastUpdate={new Date().toLocaleDateString()} linkHref="/denuncias" isLoading={isLoading} />
        <MetricCard title="Revisiones Pendientes" value="12" period="Actual" lastUpdate={new Date().toLocaleDateString()} linkHref="/revision_y_cierre" isLoading={isLoading} />
      </div>

      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          
          {/* Gráfico de Riesgo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Riesgo (Último Trimestre)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Carga por Técnico */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Carga Operativa por Técnico</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={techLoadData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="asignadas" name="Asignadas" fill="#3B82F6" /> 
                  <Bar dataKey="completadas" name="Completadas" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
