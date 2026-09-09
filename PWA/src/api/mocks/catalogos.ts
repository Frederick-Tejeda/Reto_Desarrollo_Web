export const mockProvincias = [
  { value: 'distrito_nacional', label: 'Distrito Nacional' },
  { value: 'santiago', label: 'Santiago' },
  { value: 'santo_domingo', label: 'Santo Domingo' },
];

export const mockMunicipios = {
  distrito_nacional: [
    { value: 'santo_domingo_de_guzman', label: 'Santo Domingo de Guzmán' }
  ],
  santiago: [
    { value: 'santiago_de_los_caballeros', label: 'Santiago de los Caballeros' },
    { value: 'tamboril', label: 'Tamboril' },
  ],
  santo_domingo: [
    { value: 'santo_domingo_este', label: 'Santo Domingo Este' },
    { value: 'santo_domingo_oeste', label: 'Santo Domingo Oeste' },
    { value: 'santo_domingo_norte', label: 'Santo Domingo Norte' },
  ]
};

export const mockDPS_DAS = [
  { value: 'dps_i', label: 'DPS I' },
  { value: 'dps_ii', label: 'DPS II' },
  { value: 'dps_santiago', label: 'DPS Santiago' },
];

export const mockComercializacion = [
  { value: 'local', label: 'Local' },
  { value: 'nacional', label: 'Nacional' },
  { value: 'internacional', label: 'Internacional' },
  { value: 'todos', label: 'Todos los mercados' },
];

export const mockMercadoObjetivo = [
  { value: 'infantil', label: 'Infantil' },
  { value: 'ninos', label: 'Niños' },
  { value: 'adultos', label: 'Adultos' },
  { value: 'embarazadas', label: 'Mujeres embarazadas' },
  { value: 'adultos_mayores', label: 'Adultos mayores' },
  { value: 'todos', label: 'Todos los segmentos' },
];

export const mockCategoriasAlimentos = [
  { value: 'lacteos', label: 'Lácteos y Derivados' },
  { value: 'carnicos', label: 'Cárnicos y Derivados' },
  { value: 'panaderia', label: 'Panadería y Repostería' },
];

export const mockSubcategoriasAlimentos = {
  lacteos: [
    { value: 'leche_pasteurizada', label: 'Leche Pasteurizada' },
    { value: 'quesos', label: 'Quesos' },
    { value: 'yogur', label: 'Yogur' },
  ],
  carnicos: [
    { value: 'embutidos_crudos', label: 'Embutidos Crudos' },
    { value: 'embutidos_cocidos', label: 'Embutidos Cocidos' },
  ],
  panaderia: [
    { value: 'pan', label: 'Pan' },
    { value: 'galletas', label: 'Galletas' },
  ]
};
