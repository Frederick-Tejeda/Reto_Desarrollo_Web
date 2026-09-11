import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { DragDropUpload } from '../../../Components/UI/DragDropUpload';

// -------------------------------------------------------------
// DEFINICIONES DE MOCK (RF-13 y RF-14)
// -------------------------------------------------------------

type OpcionBPM = 'C' | 'CP' | 'IT' | 'N/A';

interface FormItem {
  id: string;
  codigo: string;
  titulo: string;
  descripcion?: string;
  es_evaluable: boolean;
  padre_id: string | null;
  obligatorio?: boolean;
}

const mockFormularioBPM: FormItem[] = [
  { id: 'sec-1', codigo: '1.0', titulo: '1. Infraestructura y Edificaciones', es_evaluable: false, padre_id: null },
  { id: 'q-1', codigo: '1.1', titulo: 'Diseño e Instalaciones', descripcion: '¿Las instalaciones físicas están diseñadas de forma que facilitan la limpieza y previenen la contaminación?', es_evaluable: true, padre_id: 'sec-1', obligatorio: true },
  { id: 'q-2', codigo: '1.2', titulo: 'Iluminación y Ventilación', descripcion: '¿La iluminación y ventilación son adecuadas para las operaciones?', es_evaluable: true, padre_id: 'sec-1', obligatorio: true },
  { id: 'sec-2', codigo: '2.0', titulo: '2. Higiene del Personal', es_evaluable: false, padre_id: null },
  { id: 'q-3', codigo: '2.1', titulo: 'Vestimenta de Trabajo', descripcion: '¿El personal cuenta con vestimenta limpia, sin bolsillos por encima de la cintura?', es_evaluable: true, padre_id: 'sec-2', obligatorio: true },
];

const OPCIONES_CUMPLIMIENTO = [
  { codigo: 'C', significado: 'Cumple total', puntaje: 1.0 },
  { codigo: 'CP', significado: 'Cumple parcial', puntaje: 0.5 },
  { codigo: 'IT', significado: 'Incumplimiento total', puntaje: 0.0 },
  { codigo: 'N/A', significado: 'No aplica', puntaje: null },
];

const MOCK_CATEGORIAS = [
  { id: 'cat-1', nombre: 'Lácteos', riesgo: 2 },
  { id: 'cat-2', nombre: 'Cárnicos', riesgo: 3 },
  { id: 'cat-3', nombre: 'Panadería', riesgo: 1 },
];

export const Ejecucion: React.FC = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'PAUSADA' | 'FINALIZADA'>('PENDIENTE');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  
  // Estado para Datos Generales
  const [datosGenerales, setDatosGenerales] = useState<any>({
    dps: '', comercializacion: '', mercado: '', categorias: [], haccp: '', nivel_haccp: '',
    muestreo: '', inabie: '', distribucion: '',
  });

  const [erroresGenerales, setErroresGenerales] = useState<Record<string, string>>({});
  const [erroresPreguntas, setErroresPreguntas] = useState<Record<string, string>>({});

  // Motor: Estado dinámico de respuestas
  const [respuestas, setRespuestas] = useState<Record<string, OpcionBPM>>({});

  useEffect(() => {
    if (datosGenerales.haccp !== 'Si') setDatosGenerales((prev: any) => ({ ...prev, nivel_haccp: '' }));
  }, [datosGenerales.haccp]);

  useEffect(() => {
    if (datosGenerales.inabie !== 'Si') setDatosGenerales((prev: any) => ({ ...prev, distribucion: '' }));
  }, [datosGenerales.inabie]);


  // -------------------------------------------------------------
  // MOTOR MATEMÁTICO (RF-14)
  // -------------------------------------------------------------

  const calcularCalificacionBPM = () => {
    const evaluables = mockFormularioBPM.filter(i => i.es_evaluable);
    let sumaC = 0, sumaCP = 0, sumaNA = 0;
    evaluables.forEach(q => {
      if (respuestas[q.id] === 'C') sumaC += 1;
      else if (respuestas[q.id] === 'CP') sumaCP += 1;
      else if (respuestas[q.id] === 'N/A') sumaNA += 1;
    });
    const denominador = evaluables.length - sumaNA;
    if (denominador === 0) return 0;
    return Math.round((((sumaC * 1) + (sumaCP * 0.5)) / denominador) * 100);
  };

  const calcularRiesgoProducto = () => {
    if (datosGenerales.categorias.length === 0) return null;
    let maxRiesgo = 0;
    datosGenerales.categorias.forEach((catId: string) => {
      const cat = MOCK_CATEGORIAS.find(c => c.id === catId);
      if (cat && cat.riesgo > maxRiesgo) maxRiesgo = cat.riesgo;
    });
    return maxRiesgo; // 1, 2, 3
  };

  // RF-14.3: Riesgo Establecimiento
  const calcularRiesgoEstablecimiento = (porcentajeBPM: number) => {
    // Pesos parametrizados
    const W_VOLUMEN = 0.16;
    const W_HACCP = 0.09;
    const W_BPM = 0.56;
    const W_INABIE = 0.05;
    const W_RECHAZOS = 0.06;
    const W_MUESTREO = 0.08;

    // Puntajes parametrizados (Ej. 1.00 a 3.00)
    const SCORE_VOLUMEN = 1.67; // Mockeado para simplificar
    const SCORE_RECHAZOS = 1.00; // Mockeado para simplificar

    // HACCP Puntaje
    let scoreHACCP = 3.0;
    if (datosGenerales.haccp === 'Si') {
      if (datosGenerales.nivel_haccp === '100%') scoreHACCP = 1.0;
      else scoreHACCP = 2.0;
    }

    // BPM Puntaje (Escala inversa: mejor % BPM = menor riesgo)
    let scoreBPM = 1.0;
    if (porcentajeBPM <= 60) scoreBPM = 3.0;
    else if (porcentajeBPM <= 80) scoreBPM = 2.33;
    else if (porcentajeBPM <= 90) scoreBPM = 1.67;
    
    // INABIE Puntaje
    const scoreINABIE = datosGenerales.inabie === 'Si' ? 3.0 : 1.0;
    
    // Muestreo Puntaje
    const scoreMuestreo = datosGenerales.muestreo === 'Si' ? 1.0 : 3.0;

    const RE = 
      (SCORE_VOLUMEN * W_VOLUMEN) +
      (scoreHACCP * W_HACCP) +
      (scoreBPM * W_BPM) +
      (scoreINABIE * W_INABIE) +
      (SCORE_RECHAZOS * W_RECHAZOS) +
      (scoreMuestreo * W_MUESTREO);

    return Number(RE.toFixed(2));
  };

  const getFrecuencia = (riesgoTotal: number) => {
    if (riesgoTotal <= 3.6) return { nivel: 'Bajo', frecuencia: 'Anual', color: 'text-green-400 bg-green-900/20 border-green-500' };
    if (riesgoTotal <= 6.3) return { nivel: 'Medio', frecuencia: 'Semestral', color: 'text-yellow-400 bg-yellow-900/20 border-yellow-500' };
    return { nivel: 'Alto', frecuencia: 'Trimestral', color: 'text-red-400 bg-red-900/20 border-red-500' };
  };

  const porcentajeBPM = calcularCalificacionBPM();
  const RP = calcularRiesgoProducto();
  const RE = calcularRiesgoEstablecimiento(porcentajeBPM);
  const RT = RP !== null ? Number((RP * RE).toFixed(2)) : null; // RF-14.4 (Riesgo Total)


  // -------------------------------------------------------------
  // ACCIONES
  // -------------------------------------------------------------

  const handleIniciar = () => setEstado('EN_CURSO');

  const handleValidarYFinalizar = () => {
    const newErroresGenerales: Record<string, string> = {};
    const newErroresPreguntas: Record<string, string> = {};

    if (!datosGenerales.dps) newErroresGenerales['dps'] = 'El DPS/DAS es obligatorio.';
    if (!datosGenerales.comercializacion) newErroresGenerales['comercializacion'] = 'La Comercialización es obligatoria.';
    if (!datosGenerales.mercado) newErroresGenerales['mercado'] = 'El Mercado objetivo es obligatorio.';
    if (datosGenerales.categorias.length === 0) newErroresGenerales['categorias'] = 'Seleccione al menos una Categoría.';
    if (!datosGenerales.haccp) newErroresGenerales['haccp'] = 'Indique si tiene HACCP.';
    if (datosGenerales.haccp === 'Si' && !datosGenerales.nivel_haccp) newErroresGenerales['nivel_haccp'] = 'Obligatorio.';
    if (!datosGenerales.muestreo) newErroresGenerales['muestreo'] = 'Indique si tiene plan de muestreo.';
    if (!datosGenerales.inabie) newErroresGenerales['inabie'] = 'Indique si es suplidor de INABIE.';
    
    mockFormularioBPM.filter(i => i.es_evaluable && i.obligatorio).forEach(q => {
      if (!respuestas[q.id]) newErroresPreguntas[q.id] = 'Esta respuesta es obligatoria.';
    });

    setErroresGenerales(newErroresGenerales);
    setErroresPreguntas(newErroresPreguntas);

    const hasErrors = Object.keys(newErroresGenerales).length > 0 || Object.keys(newErroresPreguntas).length > 0;
    
    if (hasErrors) {
      alert("Existen errores de validación. Revise los campos en rojo.");
    } else {
      setEstado('FINALIZADA'); 
    }
  };

  const handleRespuesta = (preguntaId: string, opcion: OpcionBPM) => {
    if (estado !== 'EN_CURSO') return;
    setRespuestas(prev => ({ ...prev, [preguntaId]: opcion }));
    if (erroresPreguntas[preguntaId]) {
      setErroresPreguntas(prev => { const nw = {...prev}; delete nw[preguntaId]; return nw; });
    }
  };

  const toggleCategoria = (catId: string) => {
    setDatosGenerales((prev: any) => {
      const isSelected = prev.categorias.includes(catId);
      const newCats = isSelected ? prev.categorias.filter((c: string) => c !== catId) : [...prev.categorias, catId];
      return { ...prev, categorias: newCats };
    });
  };

  const dictamenBPM = () => {
    if (porcentajeBPM <= 60) return { texto: 'Inaceptable', color: 'text-red-700 bg-red-100 border-red-200' };
    if (porcentajeBPM <= 70) return { texto: 'Deficiente', color: 'text-orange-700 bg-orange-100 border-orange-200' };
    if (porcentajeBPM <= 80) return { texto: 'Regular', color: 'text-yellow-700 bg-yellow-100 border-yellow-200' };
    return { texto: 'Buena', color: 'text-green-700 bg-green-100 border-green-200' };
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-24">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluación Dinámica (RF-14)</h1>
          <p className="text-sm text-gray-500">Caso: CASO-2023-010 | Lácteos Dominicanos SA</p>
        </div>
        <div className="flex gap-2">
          {estado === 'PENDIENTE' && <Button onClick={handleIniciar}>Iniciar Inspección</Button>}
          {estado === 'EN_CURSO' && (
            <>
              <Button onClick={() => setEstado('PAUSADA')} variant="outline">Pausar</Button>
              <Button onClick={handleValidarYFinalizar}>Finalizar Validación</Button>
            </>
          )}
          {estado === 'FINALIZADA' && (
            <Button onClick={() => setEstado('EN_CURSO')} variant="outline">Modificar Respuestas</Button>
          )}
        </div>
      </div>

      {estado === 'FINALIZADA' && (
        <div className="mb-6 bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden border border-gray-700 animate-fade-in-up">
          <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>📊 Resultados Matemáticos de la Inspección</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Motor Matemático ejecutado exitosamente (RF-14.1 al RF-14.4).
              </p>
            </div>
            <button 
              onClick={() => setMostrarExplicacion(!mostrarExplicacion)} 
              className="text-xs font-bold border border-gray-600 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
            >
              {mostrarExplicacion ? 'Ocultar Explicación' : 'Ver Cómo se Calculó'}
            </button>
          </div>

          {mostrarExplicacion && (
             <div className="p-4 bg-black font-mono text-xs text-gray-300 border-b border-gray-700">
               <h3 className="text-blue-400 font-bold mb-2">{'// RF-14.4.3: Trazabilidad del Cálculo (No Editable)'}</h3>
               <p>{`[BPM] Porcentaje = ${porcentajeBPM}% -> FactorScore = ${RE > 2.0 ? 'Alto Riesgo (3.0)' : 'Bajo Riesgo (1.0)'}`}</p>
               <p>{`[Riesgo Producto] (RP) = MAX(${datosGenerales.categorias.join(', ')}) = ${RP}`}</p>
               <p>{`[Riesgo Establecimiento] (RE) = (Volumen*0.16) + (HACCP*0.09) + (BPM*0.56) + (INABIE*0.05) + (Rechazos*0.06) + (Muestreo*0.08)`}</p>
               <p>{`[RE] Cálculo real = ${RE}`}</p>
               <p>{`[Riesgo Total] (RT) = RP(${RP}) * RE(${RE}) = ${RT}`}</p>
             </div>
          )}
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Widget Calificacion BPM */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">BPM</h3>
              <div className="text-4xl font-black mb-2">{porcentajeBPM}%</div>
              <div className={`px-2 py-1 rounded border font-bold text-xs ${dictamenBPM().color}`}>
                {dictamenBPM().texto}
              </div>
            </div>

            {/* Widget Riesgo de Producto (RP) */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Riesgo Prod. (RP)</h3>
              {RP === null ? (
                <div className="text-red-400 font-bold text-xs p-2 border border-red-500 rounded bg-red-900/20">NO_CALCULABLE</div>
              ) : (
                <>
                  <div className={`text-4xl font-black mb-2 ${RP === 1 ? 'text-green-400' : RP === 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {RP.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Escala (1-3)</div>
                </>
              )}
            </div>

            {/* Widget Riesgo Establecimiento (RE) */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Riesgo Estab. (RE)</h3>
              <div className="text-4xl font-black mb-2 text-blue-400">
                {RE.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">Suma ponderada</div>
            </div>

            {/* Widget Riesgo Total (RT) */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Riesgo Total (RT)</h3>
              {RT === null ? (
                <div className="text-red-400 font-bold text-xs p-2 border border-red-500 rounded bg-red-900/20">NO_CALCULABLE (RF-14.4.5)</div>
              ) : (
                <>
                  <div className="text-5xl font-black mb-2 text-white">{RT.toFixed(1)}</div>
                  <div className={`px-2 py-1 rounded border font-bold text-xs uppercase ${getFrecuencia(RT).color}`}>
                    {getFrecuencia(RT).nivel} | {getFrecuencia(RT).frecuencia}
                  </div>
                </>
              )}
            </div>

          </div>

          <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-end">
             <Button variant="primary" onClick={() => navigate('/agenda')} disabled={RT === null}>
               {RT === null ? 'Reparar errores para Enviar' : 'Enviar Expediente Cerrado'}
             </Button>
          </div>
        </div>
      )}

      {estado !== 'PENDIENTE' && estado !== 'FINALIZADA' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="bg-gray-800 p-3 text-white font-bold flex justify-between">
              <span>Datos Generales del Establecimiento</span>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">DPS/DAS <span className="text-red-500">*</span></label>
                <select className="w-full border rounded p-2 text-sm border-gray-300" value={datosGenerales.dps} onChange={e => setDatosGenerales({...datosGenerales, dps: e.target.value})}>
                  <option value="">Seleccione...</option><option value="1">DPS Área I</option>
                </select>
                {erroresGenerales['dps'] && <p className="text-red-500 text-xs mt-1 font-bold">{erroresGenerales['dps']}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Comercialización <span className="text-red-500">*</span></label>
                <select className="w-full border rounded p-2 text-sm border-gray-300" value={datosGenerales.comercializacion} onChange={e => setDatosGenerales({...datosGenerales, comercializacion: e.target.value})}>
                  <option value="">Seleccione...</option><option value="Local">Local</option>
                </select>
                {erroresGenerales['comercializacion'] && <p className="text-red-500 text-xs mt-1 font-bold">{erroresGenerales['comercializacion']}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mercado Objetivo <span className="text-red-500">*</span></label>
                <select className="w-full border rounded p-2 text-sm border-gray-300" value={datosGenerales.mercado} onChange={e => setDatosGenerales({...datosGenerales, mercado: e.target.value})}>
                  <option value="">Seleccione...</option><option value="Todos">Todos</option>
                </select>
                {erroresGenerales['mercado'] && <p className="text-red-500 text-xs mt-1 font-bold">{erroresGenerales['mercado']}</p>}
              </div>

              <div className="md:col-span-2 lg:col-span-3 border-t border-gray-200 pt-4 mt-2">
                <label className="block text-sm font-bold text-blue-800 mb-2">Categorías Elaboradas <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {MOCK_CATEGORIAS.map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => toggleCategoria(cat.id)}
                      className={`px-3 py-1 text-sm rounded-full border font-bold transition-colors ${datosGenerales.categorias.includes(cat.id) ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {cat.nombre} (Riesgo {cat.riesgo})
                    </button>
                  ))}
                </div>
                {erroresGenerales['categorias'] && <p className="text-red-500 text-xs mt-1 font-bold">{erroresGenerales['categorias']}</p>}
              </div>

              <div className="md:col-span-2 lg:col-span-3 border-t border-gray-200 pt-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-1">HACCP <span className="text-red-500">*</span></label>
                    <select className="w-full border rounded p-2 text-sm mb-4" value={datosGenerales.haccp} onChange={e => setDatosGenerales({...datosGenerales, haccp: e.target.value})}>
                      <option value="">Seleccione...</option><option value="Si">Sí</option><option value="No">No</option>
                    </select>
                    <label className={`block text-sm font-bold text-gray-700 mb-1 ${datosGenerales.haccp !== 'Si' ? 'opacity-50' : ''}`}>Nivel <span className="text-red-500">*</span></label>
                    <select disabled={datosGenerales.haccp !== 'Si'} className={`w-full border rounded p-2 text-sm ${datosGenerales.haccp !== 'Si' ? 'bg-gray-100' : ''}`} value={datosGenerales.nivel_haccp} onChange={e => setDatosGenerales({...datosGenerales, nivel_haccp: e.target.value})}>
                      <option value="">Seleccione...</option><option value="100%">100%</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Muestreo <span className="text-red-500">*</span></label>
                    <select className="w-full border rounded p-2 text-sm mb-4" value={datosGenerales.muestreo} onChange={e => setDatosGenerales({...datosGenerales, muestreo: e.target.value})}>
                      <option value="">Seleccione...</option><option value="Si">Sí</option><option value="No">No</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-1">INABIE <span className="text-red-500">*</span></label>
                    <select className="w-full border rounded p-2 text-sm mb-4" value={datosGenerales.inabie} onChange={e => setDatosGenerales({...datosGenerales, inabie: e.target.value})}>
                      <option value="">Seleccione...</option><option value="Si">Sí</option><option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="space-y-6">
            {mockFormularioBPM.filter(i => i.padre_id === null).map(seccion => (
              <div key={seccion.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="bg-gray-800 p-3 text-white font-bold flex justify-between">
                  <span>{seccion.titulo}</span>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {mockFormularioBPM.filter(i => i.padre_id === seccion.id).map(pregunta => {
                    const respuestaActual = respuestas[pregunta.id];
                    const hasError = !!erroresPreguntas[pregunta.id];
                    
                    return (
                      <div key={pregunta.id} className={`p-4 md:p-6 transition-colors hover:bg-gray-50 ${hasError ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
                        <div className="flex justify-between gap-4 mb-3">
                          <h3 className={`font-medium text-sm md:text-base ${hasError ? 'text-red-900' : 'text-gray-900'}`}>
                            <span className="text-gray-400 mr-2">{pregunta.codigo}</span>
                            {pregunta.titulo}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {OPCIONES_CUMPLIMIENTO.map(op => {
                            const isSelected = respuestaActual === op.codigo;
                            let btnColorClass = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
                            
                            if (isSelected) {
                              if (op.codigo === 'C') btnColorClass = "bg-green-600 text-white border-green-700";
                              else if (op.codigo === 'CP') btnColorClass = "bg-yellow-500 text-white border-yellow-600";
                              else if (op.codigo === 'IT') btnColorClass = "bg-red-600 text-white border-red-700";
                              else btnColorClass = "bg-gray-600 text-white border-gray-700";
                            }
                            
                            return (
                              <button
                                key={op.codigo}
                                onClick={() => handleRespuesta(pregunta.id, op.codigo as OpcionBPM)}
                                className={`px-3 py-2 text-sm font-bold border rounded transition-all ${btnColorClass}`}
                              >
                                {op.codigo}
                              </button>
                            );
                          })}
                        </div>

                        {respuestaActual === 'IT' && (
                          <div className="mt-4 p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg animate-fade-in">
                            <label className="block text-xs font-bold text-red-800 mb-2">
                              Evidencia Fotográfica Requerida (Incumplimiento Total detectado)
                            </label>
                            <DragDropUpload />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {estado === 'PENDIENTE' && (
        <div className="bg-white rounded-lg shadow border border-gray-200 text-center py-20 text-gray-500">
          <p className="font-medium">Formulario Bloqueado</p>
          <p className="text-sm">Presione "Iniciar Inspección" para comenzar a evaluar.</p>
        </div>
      )}
    </div>
  );
};