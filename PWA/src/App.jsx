import './main.css'
import { Routes, Route } from 'react-router'
import Inicio_de_sesion from './Rutas/Publica/Inicio_de_sesion/Inicio_de_sesion'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio_de_sesion />} />
      </Routes>
    </>
  )
}

export default App
