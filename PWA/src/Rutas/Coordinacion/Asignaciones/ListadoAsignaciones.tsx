import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Skeleton } from '../../../Components/UI/Skeleton';
import { Select } from '../../../Components/UI/Select';
import { Alert } from '../../../Components/UI/Alert';

const mockAsignaciones = [
  {
    id: 'CASO-2023-010',
    empresa: 'Lácteos Dominicanos SA',
    establecimiento: 'Planta Sur',
    prioridad: 'ALTA',
    fecha_programada: '2023-11-05 09:00',
    tecnico: 'María Gómez',
    estado: 'PROGRAMADO',
    historialResponsables: []
  },
  {
    id: 'CASO-2023-012',
    empresa: 'Distribuidora Central',
    establecimiento: 'Almacén Principal',
    prioridad: 'MEDIA',
    fecha_programada: '2023-11-08 14:00',
    tecnico: 'Juan Pérez',
    estado: 'ASIGNADO',
    historialResponsables: [{ nombre: 'Pedro Ramírez', fechaAsignacion: '2023-10-30', motivoCambio: 'Permiso médico' }]
  },
];

export const ListadoAsignaciones: React.FC = () => {
  const navigate = useNavigate();
  const [asignaciones, setAsignaciones] = useState(mockAsignaciones);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del Modal de Reasignación
  const [showModal, setShowModal] = useState(false);
  const [casoSeleccionado, setCasoSeleccionado] = useState<any>(null);
  const [nuevoTecnico, setNuevoTecnico] = useState('');
  const [motivoReasignacion, setMotivoReasignacion] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleReasignar = (caso: any) => {
    setCasoSeleccionado(caso);
    setNuevoTecnico('');
    setMotivoReasignacion('');
    setShowModal(true);
  };

  const confirmReasignacion = () => {
    if (!nuevoTecnico) {
      alert("Debe seleccionar un nuevo técnico.");
      return;
    }
    if (!motivoReasignacion.trim()) {
      alert("El motivo de reasignación es obligatorio (RF-10).");
      return;
    }

    const nombreNuevoTecnico = nuevoTecnico === 'TEC-001' ? 'Juan Pérez' : (nuevoTecnico === 'TEC-002' ? 'María Gómez' : 'Pedro Ramírez');

    // Simulate updating and saving history
    const updatedAsignaciones = asignaciones.map(a => {
      if (a.id === casoSeleccionado.id) {
        const nuevoHistorial = [...a.historialResponsables];
        if (a.tecnico) {
          nuevoHistorial.push({
            nombre: a.tecnico,
            fechaAsignacion: new Date().toISOString().split('T')[0],
            motivoCambio: motivoReasignacion
          });
        }
        return {
          ...a,
          tecnico: nombreNuevoTecnico,
          estado: 'ASIGNADO',
          historialResponsables: nuevoHistorial
        };
      }
      return a;
    });
    setAsignaciones(updatedAsignaciones);
    setShowModal(false);

    // Simular el cumplimiento de RF10
    alert(`Reasignación exitosa para ${casoSeleccionado.id}:\n- Responsable anterior guardado en el historial.\n- Revocado el acceso al expediente para ${casoSeleccionado.tecnico || 'N/A'}.\n- Notificaciones enviadas a ${casoSeleccionado.tecnico || 'N/A'} y ${nombreNuevoTecnico}.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asignaciones y Carga de Trabajo</h1>
          <p className="text-sm text-gray-500">Gestión de evaluadores y reasignación de casos (RF-10).</p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton type="text" className="w-full" />
            <Skeleton type="text" className="w-full" />
          </div>
        ) : asignaciones.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No hay casos pendientes de asignar o reasignar.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {asignaciones.map((asignacion) => (
              <li key={asignacion.id} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 mr-2">{asignacion.id}</p>
                      <span className={`px-2 rounded-full text-xs font-bold ${asignacion.prioridad === 'ALTA' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'
                        }`}>
                        {asignacion.prioridad}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{asignacion.empresa} • {asignacion.establecimiento}</p>
                      <p className="text-xs mt-1">
                        <strong>Programado para:</strong> {asignacion.fecha_programada} |
                        <strong> Técnico:</strong> {asignacion.tecnico || 'Sin asignar'}
                      </p>
                      {asignacion.historialResponsables.length > 0 && (
                        <div className="mt-2 text-xs bg-gray-50 p-2 rounded border">
                          <p className="font-semibold text-gray-700 mb-1">Historial de Responsables Anteriores (RF-10):</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {asignacion.historialResponsables.map((h, i) => (
                              <li key={i}>
                                <strong>{h.nombre}</strong> (hasta {h.fechaAsignacion}). Motivo: <em>{h.motivoCambio}</em>. Acceso revocado.
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => handleReasignar(asignacion)}>
                      {asignacion.tecnico ? 'Reasignar' : 'Asignar'}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de Reasignación */}
      {showModal && casoSeleccionado && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Reasignar Técnico</h3>
                <p className="text-sm text-gray-500 mb-4">Caso: {casoSeleccionado.id}</p>

                <Alert type="info" className="mb-4" title="Regla Institucional">
                  La reasignación debe exigir un motivo, el cual quedará registrado en el historial y notificará a las partes involucradas.
                </Alert>

                <div className="space-y-4">
                  <Select
                    label="Seleccionar Nuevo Técnico"
                    name="nuevoTecnico"
                    value={nuevoTecnico}
                    onChange={(e) => setNuevoTecnico(e.target.value)}
                    options={[
                      { value: 'TEC-001', label: 'Juan Pérez (Carga: 3 activas, 1 hoy)' },
                      { value: 'TEC-002', label: 'María Gómez (Carga: 5 activas, 2 hoy) - ALTA CARGA' },
                      { value: 'TEC-003', label: 'Pedro Ramírez (Carga: 0 activas, 0 hoy) - DISPONIBLE' }
                    ]}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Motivo (Obligatorio)</label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={3}
                      value={motivoReasignacion}
                      onChange={(e) => setMotivoReasignacion(e.target.value)}
                      placeholder="Justifique el cambio de asignación..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button onClick={confirmReasignacion} className="w-full sm:ml-3 sm:w-auto">
                  Confirmar Asignación
                </Button>
                <Button onClick={() => setShowModal(false)} variant="outline" className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
