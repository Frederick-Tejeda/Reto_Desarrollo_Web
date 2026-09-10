import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';

export interface RegistroConsulta {
  id: string; // caso o informe
  empresa: string;
  rnc: string;
  fecha: string;
  estado: string;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'N/A';
  tecnico: string;
}

const dbMock: RegistroConsulta[] = [
  { id: 'CASO-2023-010', empresa: 'Lácteos Dominicanos SA', rnc: '101010101', fecha: '2023-11-10', estado: 'CERRADO', riesgo: 'ALTO', tecnico: 'Juan Pérez' },
  { id: 'CASO-2023-011', empresa: 'Lácteos Dominicanos SA', rnc: '101010101', fecha: '2023-05-15', estado: 'CERRADO', riesgo: 'MEDIO', tecnico: 'María Gómez' },
  { id: 'CASO-2023-015', empresa: 'Carnes del Norte', rnc: '202020202', fecha: '2023-11-06', estado: 'EN PROCESO', riesgo: 'N/A', tecnico: 'María Gómez' },
];

export const ListadoConsulta: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    empresa: '',
    rnc: '',
    estado: '',
    riesgo: ''
  });
  
  const [resultados, setResultados] = useState<RegistroConsulta[] | null>(null);

  const handleBuscar = () => {
    // Simulando filtro combinable (RF-20.2)
    const filtrados = dbMock.filter(reg => {
      return (
        (filtros.empresa === '' || reg.empresa.toLowerCase().includes(filtros.empresa.toLowerCase())) &&
        (filtros.rnc === '' || reg.rnc.includes(filtros.rnc)) &&
        (filtros.estado === '' || reg.estado === filtros.estado) &&
        (filtros.riesgo === '' || reg.riesgo === filtros.riesgo)
      );
    });
    setResultados(filtrados);
  };

  const handleLimpiar = () => {
    setFiltros({ empresa: '', rnc: '', estado: '', riesgo: '' });
    setResultados(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consulta Histórica (RF-20)</h1>
          <p className="text-sm text-gray-500">Búsqueda transversal de expedientes y línea de tiempo.</p>
        </div>
        <Button variant="outline" onClick={() => alert('Exportando a CSV (RF-20.2)')}>Exportar CSV</Button>
      </div>

      {/* Formulario de Filtros */}
      <div className="bg-white p-4 shadow rounded-lg mb-6 border border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Filtros de Búsqueda</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Empresa</label>
            <input 
              type="text" 
              className="w-full border-gray-300 rounded shadow-sm text-sm p-2 border" 
              value={filtros.empresa} onChange={e => setFiltros({...filtros, empresa: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">RNC</label>
            <input 
              type="text" 
              className="w-full border-gray-300 rounded shadow-sm text-sm p-2 border" 
              value={filtros.rnc} onChange={e => setFiltros({...filtros, rnc: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Estado</label>
            <select 
              className="w-full border-gray-300 rounded shadow-sm text-sm p-2 border bg-white"
              value={filtros.estado} onChange={e => setFiltros({...filtros, estado: e.target.value})}
            >
              <option value="">Todos</option>
              <option value="EN PROCESO">En Proceso</option>
              <option value="CERRADO">Cerrado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Nivel de Riesgo</label>
            <select 
              className="w-full border-gray-300 rounded shadow-sm text-sm p-2 border bg-white"
              value={filtros.riesgo} onChange={e => setFiltros({...filtros, riesgo: e.target.value})}
            >
              <option value="">Todos</option>
              <option value="ALTO">Alto</option>
              <option value="MEDIO">Medio</option>
              <option value="BAJO">Bajo</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleLimpiar}>Limpiar Filtros</Button>
          <Button variant="primary" onClick={handleBuscar}>Buscar</Button>
        </div>
      </div>

      {/* Resultados y Estados Vacíos (RF-20.5) */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        {resultados === null ? (
          <div className="p-10 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <p className="font-medium text-gray-900">Ingrese criterios de búsqueda</p>
            <p className="text-sm">Utilice los filtros superiores para encontrar registros históricos.</p>
          </div>
        ) : resultados.length === 0 ? (
          <div className="p-10 text-center text-red-500">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="font-medium text-gray-900">Sin resultados para los filtros actuales</p>
            <p className="text-sm text-gray-500">Intente limpiar los filtros o probar otra combinación (RF-20.5).</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {resultados.map((reg) => (
              <li key={reg.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-blue-600">{reg.id}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200">{reg.estado}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{reg.empresa} (RNC: {reg.rnc})</p>
                  <p className="text-xs text-gray-500 mt-1">Fecha: {reg.fecha} | Riesgo: {reg.riesgo}</p>
                </div>
                <Button variant="outline" onClick={() => navigate(`/consulta_historica/${reg.id}`)}>
                  Ver Historial
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        * Las consultas respetan su ámbito y confidencialidad asignada (RF-20.4).
      </div>
    </div>
  );
};
