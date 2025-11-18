import { useState, useEffect } from 'react'

function ListaPersonal({ onClickSerie, busqueda }) {

  const [favoritos, setFavoritos] = useState([])

  const cargarFavoritos = () => {
    const favoritosGuardados = localStorage.getItem('favoritos')
    // texto = '[{"id":1,"name":"Breaking Bad"},{"id":2,"name":"Friends"}]'
    // ↑ Es un STRING (texto), NO un array
    if (favoritosGuardados) {
      setFavoritos(JSON.parse(favoritosGuardados))
      // array = [ { id: 1, name: "Breaking Bad" }, { id: 2, name: "Friends" } ]
      // ↑ Ahora SÍ es un array que puedes usar
    } else {
      setFavoritos([])
    }
  }

  useEffect(() => {
    cargarFavoritos()
  }, [])
  // ↑ Array vacío [] = solo se ejecuta cuando el componente se monta

  useEffect(() => {
    const interval = setInterval(cargarFavoritos, 1000)
    return () => clearInterval(interval)
  }, [])
  // ↑ Detecta cambios en localStorage hechos desde otros componentes.

  const eliminarFavorito = (id, event) => {
    event.stopPropagation()
    const nuevosFavoritos = favoritos.filter(serie => serie.id !== id)
    setFavoritos(nuevosFavoritos)
    localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos))
  }

  // FILTRAR favoritos por búsqueda
  const favoritosFiltrados = favoritos.filter(serie =>
    serie.name.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <h2>Mi Lista Personal</h2>
      <h2>({favoritosFiltrados.length})</h2>
      
      {favoritosFiltrados.length === 0 ? (
        <p style={{textAlign: 'center', fontSize: '18px', marginTop: '50px'}}>
          {busqueda ? 'No se encontraron resultados' : 'No tienes series favoritas aún'}
        </p>
      ) : (
        <div className="lista-series">
          {favoritosFiltrados.map((serie) => (
            // ↑ Usa favoritosFiltrados
            <div key={serie.id} onClick={() => onClickSerie(serie)}>
              <h3>{serie.name}</h3>
              <p>Género: {serie.genres?.join(', ')}</p>
              <img src={serie.image?.medium} alt={serie.name} />
              <button onClick={(e) => eliminarFavorito(serie.id, e)}>
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListaPersonal