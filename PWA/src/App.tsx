import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Rutas Publicas
import Error from './Rutas/Publica/Error/Error';
import Inicio_de_sesion from './Rutas/Publica/Inicio_de_sesion/Inicio_de_sesion';
import Nueva_Contraseña from './Rutas/Publica/Nueva_Contraseña/Nueva_Contraseña';
import Offline from './Rutas/Publica/Offline/Offline';
import OTP from './Rutas/Publica/OTP/OTP';
import Recuperacion from './Rutas/Publica/Recuperacion/Recuperacion';

// Rutas de General
import Ayuda from './Rutas/General/Ayuda/Ayuda';
import Cambio_de_contraseña from './Rutas/General/Cambio_de_contraseña/Cambio_de_contraseña';
import Dashboard from './Rutas/General/Dashboard/Dashboard';
import Perfil from './Rutas/General/Perfil/Perfil';

// Rutas de Evaluacion
import Agenda from './Rutas/Evaluacion/Agenda/Agenda';
import Descarga_offline from './Rutas/Evaluacion/Descarga_offline/Descarga_offline';
import Ejecucion from './Rutas/Evaluacion/Ejecucion/Ejecucion';
import Envio from './Rutas/Evaluacion/Envio/Envio';
import Evidencias from './Rutas/Evaluacion/Evidencias/Evidencias';
import Resumen from './Rutas/Evaluacion/Resumen/Resumen';
import Sincronización from './Rutas/Evaluacion/Sincronización/Sincronización';

// Rutas de Empresa
import Casos from './Rutas/Empresa/Casos/Casos';
import Correcciones from './Rutas/Empresa/Correcciones/Correcciones';
import Delegados from './Rutas/Empresa/Delegados/Delegados';
import Empresas from './Rutas/Empresa/Empresas/Empresas';
import Establecimientos from './Rutas/Empresa/Establecimientos/Establecimientos';
import Informes from './Rutas/Empresa/Informes/Informes';
import Solicitudes from './Rutas/Empresa/Solicitudes/Solicitudes';

// Rutas de Coordinacion
import Asignaciones from './Rutas/Coordinacion/Asignaciones/Asignaciones';
import Bandeja_de_casos from './Rutas/Coordinacion/Bandeja_de_casos/Bandeja_de_casos';
import Denuncias from './Rutas/Coordinacion/Denuncias/Denuncias';
import Programacion from './Rutas/Coordinacion/Programacion/Programacion';
import Revision_y_cierre from './Rutas/Coordinacion/Revision_y_cierre/Revision_y_cierre';

// Rutas de Administracion
import Auditoria from './Rutas/Administracion/Auditoria/Auditoria';
import Catalogos from './Rutas/Administracion/Catalogos/Catalogos';
import Fichas from './Rutas/Administracion/Fichas/Fichas';
import Plantillas_de_correo from './Rutas/Administracion/Plantillas_de_correo/Plantillas_de_correo';
import Reglas_de_riesgo from './Rutas/Administracion/Reglas_de_riesgo/Reglas_de_riesgo';
import Roles from './Rutas/Administracion/Roles/Roles';
import Salud_operativa_autorizada from './Rutas/Administracion/Salud_operativa_autorizada/Salud_operativa_autorizada';
import Usuarios from './Rutas/Administracion/Usuarios/Usuarios';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/error" element={<Error />} />
        <Route path="/offline" element={<Offline />} />
        <Route path="/" element={<Inicio_de_sesion />} />
        <Route path="/nueva_contraseña" element={<Nueva_Contraseña />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/recuperacion" element={<Recuperacion />} />

        {/* Rutas de General */}
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/cambio_de_contraseña" element={<Cambio_de_contraseña />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Rutas de Evaluacion */}
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/descarga_offline" element={<Descarga_offline />} />
        <Route path="/ejecucion" element={<Ejecucion />} />
        <Route path="/envio" element={<Envio />} />
        <Route path="/evidencias" element={<Evidencias />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/sincronización" element={<Sincronización />} />

        {/* Rutas de Empresa */}
        <Route path="/casos" element={<Casos />} />
        <Route path="/correcciones" element={<Correcciones />} />
        <Route path="/delegados" element={<Delegados />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/establecimientos" element={<Establecimientos />} />
        <Route path="/informes" element={<Informes />} />
        <Route path="/solicitudes" element={<Solicitudes />} />

        {/* Rutas de Coordinacion */}
        <Route path="/asignaciones" element={<Asignaciones />} />
        <Route path="/bandeja_de_casos" element={<Bandeja_de_casos />} />
        <Route path="/denuncias" element={<Denuncias />} />
        <Route path="/programacion" element={<Programacion />} />
        <Route path="/revision_y_cierre" element={<Revision_y_cierre />} />

        {/* Rutas de Administracion */}
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/catalogos" element={<Catalogos />} />
        <Route path="/fichas" element={<Fichas />} />
        <Route path="/plantillas_de_correo" element={<Plantillas_de_correo />} />
        <Route path="/reglas_de_riesgo" element={<Reglas_de_riesgo />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/salud_operativa_autorizada" element={<Salud_operativa_autorizada />} />
        <Route path="/usuarios" element={<Usuarios />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
