import React, { useState } from 'react';
import { Button } from '../../../Components/UI/Button';

// Mocks para RF-22
type CatalogoKey = 'PROVINCIAS' | 'MUNICIPIOS' | 'FACTORES';

const mockProvincias = [
  { id: 'P01', nombre: 'Distrito Nacional', estado: 'ACTIVO' },
  { id: 'P02', nombre: 'Santiago', estado: 'ACTIVO' },
  { id: 'P03', nombre: 'Santo Domingo', estado: 'INACTIVO' }, // Desactivación lógica (RF-22.3)
];

const mockMunicipios = [
  { id: 'M01', nombre: 'Santo Domingo de Guzmán', provinciaId: 'P01', estado: 'ACTIVO' },
  { id: 'M02', nombre: 'Santiago de los Caballeros', provinciaId: 'P02', estado: 'ACTIVO' },
];

const mockFactores = [
  { id: 'F01-v1', nombre: 'Multiplicador de Riesgo Alimentario', valor: '1.5', version: 1, estado: 'ACTIVO' },
  { id: 'F02-v1', nombre: 'Penalización por Reincidencia', valor: '0.8', version: 1, estado: 'ACTIVO' },
];

export default function Catalogos() {
  const [selectedCatalogo, setSelectedCatalogo] = useState<CatalogoKey>('PROVINCIAS');
  
  const [provincias, setProvincias] = useState(mockProvincias);
  const [municipios, setMunicipios] = useState(mockMunicipios);
  const [factores, setFactores] = useState(mockFactores);

  // Funciones de acción simuladas
  const toggleEstado = (catalogo: CatalogoKey, id: string) => {
    if (catalogo === 'PROVINCIAS') {
      setProvincias(prev => prev.map(p => p.id === id ? { ...p, estado: p.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : p));
    }
  };

  const handleCrearVersionFactor = (idBase: string, nombre: string, currentVersion: number) => {
    // RF-22.5: Cambios que afecten cálculo requerirán nueva versión
    const newValue = prompt(`Ingrese el nuevo valor para ${nombre} (Nueva Versión v${currentVersion + 1}):`);
    if (newValue) {
      const newFactor = {
        id: `${idBase.split('-')[0]}-v${currentVersion + 1}`,
        nombre,
        valor: newValue,
        version: currentVersion + 1,
        estado: 'ACTIVO'
      };
      setFactores([newFactor, ...factores]);
      alert("Nueva versión creada. Pendiente de aprobación (RF-22.5).");
    }
  };

  const renderTabla = () => {
    if (selectedCatalogo === 'PROVINCIAS') {
      return (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {provincias.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                    <button 
                      className={`${p.estado === 'ACTIVO' ? 'text-red-600' : 'text-green-600'}`}
                      onClick={() => toggleEstado('PROVINCIAS', p.id)}
                    >
                      {p.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedCatalogo === 'MUNICIPIOS') {
      return (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provincia (Dependencia)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {municipios.map(m => {
                const prov = provincias.find(p => p.id === m.provinciaId);
                return (
                  <tr key={m.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prov ? prov.nombre : <span className="text-red-500 font-bold">Sin asignar</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => alert("Mostrando modal de edición exgiendo seleccionar Provincia (RF-22.4)")}>Editar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedCatalogo === 'FACTORES') {
      return (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-yellow-50 p-4 border-b border-yellow-200 text-sm text-yellow-800">
            <strong>Atención (RF-22.5):</strong> Estas variables afectan los cálculos del motor de reglas. No pueden editarse en caliente. Cualquier modificación generará una nueva versión.
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Actual</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {factores.map(f => (
                <tr key={f.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.id} <span className="text-gray-400 text-xs ml-1">(v{f.version})</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{f.valor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-purple-600 hover:text-purple-900"
                      onClick={() => handleCrearVersionFactor(f.id, f.nombre, f.version)}
                    >
                      + Nueva Versión
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar de Catálogos */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Diccionarios</h2>
        </div>
        <div className="p-2 space-y-1">
          <p className="px-3 py-2 text-xs font-bold text-gray-400 mt-2">GEOGRAFÍA</p>
          <button 
            className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCatalogo === 'PROVINCIAS' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setSelectedCatalogo('PROVINCIAS')}
          >
            Provincias
          </button>
          <button 
            className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCatalogo === 'MUNICIPIOS' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setSelectedCatalogo('MUNICIPIOS')}
          >
            Municipios
          </button>

          <p className="px-3 py-2 text-xs font-bold text-gray-400 mt-4">MOTOR DE REGLAS</p>
          <button 
            className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCatalogo === 'FACTORES' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setSelectedCatalogo('FACTORES')}
          >
            Factores de Riesgo
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de {selectedCatalogo.toLowerCase()} (RF-22)</h1>
            <p className="text-sm text-gray-500">Administración de valores estáticos y parámetros de cálculo.</p>
          </div>
          <Button variant="primary">Nuevo Registro</Button>
        </div>

        {renderTabla()}

      </div>
    </div>
  );
}