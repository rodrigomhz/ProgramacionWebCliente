import { useState } from 'react'
import './App.css'
import Series from './components/Series'
import ListaPersonal from './components/ListaPersonal'
import ModalDetalle from './components/ModalDetalle'

function App() {
  const [mostrarModal, setMostrarModal] = useState(false)
  const [serieSeleccionada, setSerieSeleccionada] = useState(null)
  const [vistaActual, setVistaActual] = useState('series') // 'series' o 'favoritos'
  const [busqueda, setBusqueda] = useState('')

  const abrirModal = (serie) => {
    setSerieSeleccionada(serie)
    setMostrarModal(true)
  }

  return (
    <div>
      <h1>TvMaze</h1>
      <div>
        <h3>
          <input type="text" placeholder="Buscar series..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}></input>
        <button onClick={() => setVistaActual('series')}>Series</button>
        <button onClick={() => setVistaActual('favoritos')}>Favoritos</button>
        </h3>
      </div>
      
      {vistaActual === 'series' ? (
        <Series onClickSerie={abrirModal} busqueda={busqueda} />
      ) : (
        <ListaPersonal onClickSerie={abrirModal} busqueda={busqueda}/>
      )}

      {mostrarModal && serieSeleccionada && (
        <ModalDetalle 
          serie={serieSeleccionada}
          onCerrar={() => setMostrarModal(false)} 
        />
      )}
    </div>
  )
}

export default App