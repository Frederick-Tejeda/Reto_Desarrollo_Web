import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import type { Event as CalendarEvent, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DetalleEventoModal } from './DetalleEventoModal';
import { Alert } from '../../../Components/UI/Alert';
import { Button } from '../../../Components/UI/Button';

// Setup the localizer by providing the date-fns functions
const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface InspeccionEvent extends CalendarEvent {
  id: string;
  empresa: string;
  establecimiento: string;
  direccion: string;
  estado: 'PROGRAMADO' | 'FINALIZADO' | 'EN_CURSO';
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  disponibleOffline: boolean;
}

const mockEvents: InspeccionEvent[] = [
  {
    id: 'CASO-2023-010',
    title: 'Inspección - Lácteos Dominicanos SA',
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    empresa: 'Lácteos Dominicanos SA',
    establecimiento: 'Planta Sur',
    direccion: 'Av. Industrial 45, Zona Sur',
    estado: 'PROGRAMADO',
    prioridad: 'ALTA',
    disponibleOffline: true,
  },
  {
    id: 'CASO-2023-012',
    title: 'Inspección - Distribuidora Central',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(16, 0, 0, 0)),
    empresa: 'Distribuidora Central',
    establecimiento: 'Almacén Principal',
    direccion: 'Calle 10, Ensanche La Fe',
    estado: 'FINALIZADO',
    prioridad: 'MEDIA',
    disponibleOffline: false,
  },
];

export const Agenda: React.FC = () => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<InspeccionEvent | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(evt => filtroEstado === 'TODOS' || evt.estado === filtroEstado);
  }, [filtroEstado]);

  const eventPropGetter = (event: InspeccionEvent) => {
    let backgroundColor = '#3174ad'; // default blue
    if (event.prioridad === 'ALTA') backgroundColor = '#dc2626'; // red-600
    if (event.estado === 'FINALIZADO') backgroundColor = '#16a34a'; // green-600

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
      }
    };
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda de Inspecciones (RF-11)</h1>
          <p className="text-sm text-gray-500">Calendario del evaluador.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white border"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PROGRAMADO">Programados</option>
            <option value="FINALIZADO">Finalizados</option>
            <option value="EN_CURSO">En curso</option>
          </select>
          <Button
            variant={isOffline ? "danger" : "outline"}
            onClick={() => setIsOffline(!isOffline)}
          >
            {isOffline ? 'Volver Online' : 'Simular Offline'}
          </Button>
        </div>
      </div>

      {isOffline && (
        <Alert type="warning" className="mb-4" title="Modo sin conexión">
          Mostrando la última agenda sincronizada. No se asumirán cambios no confirmados por el servidor.
        </Alert>
      )}

      <div className="flex-1 bg-white p-4 rounded-lg shadow min-h-[500px]">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          view={view}
          onView={(newView) => setView(newView)}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          onSelectEvent={(event) => setSelectedEvent(event as InspeccionEvent)}
          eventPropGetter={eventPropGetter}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Lista",
            noEventsInRange: "No hay inspecciones en este rango."
          }}
        />
      </div>

      {selectedEvent && (
        <DetalleEventoModal
          evento={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};