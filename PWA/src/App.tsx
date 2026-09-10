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
import { ListadoConsulta } from './Rutas/General/Consulta_Historica/ListadoConsulta';
import { DetalleHistorico } from './Rutas/General/Consulta_Historica/DetalleHistorico';
import { CentroNotificaciones } from './Rutas/General/Notificaciones/CentroNotificaciones';

// Rutas de Evaluacion
import { Agenda } from './Rutas/Evaluacion/Agenda/Agenda';
import Descarga_offline from './Rutas/Evaluacion/Descarga_offline/Descarga_offline';
import { Ejecucion } from './Rutas/Evaluacion/Ejecucion/Ejecucion';
import Envio from './Rutas/Evaluacion/Envio/Envio';
import Evidencias from './Rutas/Evaluacion/Evidencias/Evidencias';
import Resumen from './Rutas/Evaluacion/Resumen/Resumen';
import Sincronización from './Rutas/Evaluacion/Sincronización/Sincronización';

// Rutas de Empresa
import Casos from './Rutas/Empresa/Casos/Casos';
import { ListadoCorrecciones } from './Rutas/Empresa/Correcciones/ListadoCorrecciones';
import { DetalleCorreccion } from './Rutas/Empresa/Correcciones/DetalleCorreccion';
import Delegados from './Rutas/Empresa/Delegados/Delegados';
import { ListadoEmpresas } from './Rutas/Empresa/Empresas/ListadoEmpresas';
import { FormularioEmpresa } from './Rutas/Empresa/Empresas/FormularioEmpresa';
import { ListadoEstablecimientos } from './Rutas/Empresa/Establecimientos/ListadoEstablecimientos';
import { FormularioEstablecimiento } from './Rutas/Empresa/Establecimientos/FormularioEstablecimiento';
import { ListadoInformes } from './Rutas/Empresa/Informes/ListadoInformes';
import { VisorInforme } from './Rutas/Empresa/Informes/VisorInforme';
import { ListadoSolicitudes } from './Rutas/Empresa/Solicitudes/ListadoSolicitudes';
import { FormularioSolicitud } from './Rutas/Empresa/Solicitudes/FormularioSolicitud';

// Rutas de Coordinacion
import { ListadoCasos } from './Rutas/Coordinacion/Bandeja_de_casos/ListadoCasos';
import { DetalleCaso } from './Rutas/Coordinacion/Bandeja_de_casos/DetalleCaso';
import { CierreExpediente } from './Rutas/Coordinacion/Bandeja_de_casos/CierreExpediente';
import { ListadoDenuncias } from './Rutas/Coordinacion/Denuncias/ListadoDenuncias';
import { FormularioDenuncia } from './Rutas/Coordinacion/Denuncias/FormularioDenuncia';
import { ListadoProgramacion } from './Rutas/Coordinacion/Programacion/ListadoProgramacion';
import { FormularioProgramacion } from './Rutas/Coordinacion/Programacion/FormularioProgramacion';
import { ListadoAsignaciones } from './Rutas/Coordinacion/Asignaciones/ListadoAsignaciones';
import { ListadoAlertas } from './Rutas/Coordinacion/Bandeja_de_casos/ListadoAlertas';
import { DetalleAlerta } from './Rutas/Coordinacion/Bandeja_de_casos/DetalleAlerta';
import { ListadoRevisiones } from './Rutas/Coordinacion/Revision_y_cierre/ListadoRevisiones';
import { RevisarEvaluacion } from './Rutas/Coordinacion/Revision_y_cierre/RevisarEvaluacion';

// Rutas de Administracion
import Auditoria from './Rutas/Administracion/Auditoria/Auditoria';
import Catalogos from './Rutas/Administracion/Catalogos/Catalogos';
import { ListadoFichas } from './Rutas/Administracion/Fichas/ListadoFichas';
import { EditorFicha } from './Rutas/Administracion/Fichas/EditorFicha';
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
        <Route path="/consulta_historica" element={<ListadoConsulta />} />
        <Route path="/consulta_historica/:id" element={<DetalleHistorico />} />
        <Route path="/notificaciones" element={<CentroNotificaciones />} />

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
        <Route path="/correcciones" element={<ListadoCorrecciones />} />
        <Route path="/correcciones/:id" element={<DetalleCorreccion />} />
        <Route path="/delegados" element={<Delegados />} />
        <Route path="/empresas" element={<ListadoEmpresas />} />
        <Route path="/empresas/nueva" element={<FormularioEmpresa />} />
        <Route path="/establecimientos" element={<ListadoEstablecimientos />} />
        <Route path="/establecimientos/nuevo" element={<FormularioEstablecimiento />} />
        <Route path="/informes" element={<ListadoInformes />} />
        <Route path="/informes/:id" element={<VisorInforme />} />
        <Route path="/solicitudes" element={<ListadoSolicitudes />} />
        <Route path="/solicitudes/nueva" element={<FormularioSolicitud />} />
        <Route path="/solicitudes/:id" element={<FormularioSolicitud />} />

        {/* Rutas de Coordinacion */}
        <Route path="/bandeja_de_casos" element={<ListadoCasos />} />
        <Route path="/bandeja_de_casos/:id" element={<DetalleCaso />} />
        <Route path="/bandeja_de_casos/:id/cierre" element={<CierreExpediente />} />
        <Route path="/denuncias" element={<ListadoDenuncias />} />
        <Route path="/denuncias/:id" element={<FormularioDenuncia />} />
        <Route path="/programacion" element={<ListadoProgramacion />} />
        <Route path="/programacion/:id" element={<FormularioProgramacion />} />
        <Route path="/asignaciones" element={<ListadoAsignaciones />} />
        <Route path="/alertas_lapch" element={<ListadoAlertas />} />
        <Route path="/alertas_lapch/:id" element={<DetalleAlerta />} />
        <Route path="/revision_y_cierre" element={<ListadoRevisiones />} />
        <Route path="/revision_y_cierre/:id" element={<RevisarEvaluacion />} />

        {/* Rutas de Administracion */}
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/catalogos" element={<Catalogos />} />
        <Route path="/fichas" element={<ListadoFichas />} />
        <Route path="/fichas/editor/:id" element={<EditorFicha />} />
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
