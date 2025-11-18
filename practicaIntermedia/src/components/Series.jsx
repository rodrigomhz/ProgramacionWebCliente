import { useState, useEffect } from 'react'

function Series({ onClickSerie, busqueda }) {
  const [series, setSeries] = useState([])

  async function loadPosts() {
    const res = await fetch('https://api.tvmaze.com/shows', {
      cache: 'no-store'
    });
    return res.json();
  }

  useEffect(() => {
    loadPosts()
      .then(data => {
        console.log(data)
        setSeries(data)// Guarda el contenido en el array de series
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }, [])

  // Función para añadir a favoritos
  const agregarAFavoritos = (serie, event) => {
    event.stopPropagation()
    const favoritosActuales = JSON.parse(localStorage.getItem('favoritos') || '[]')
    
    // Verificar si ya existe
    const yaExiste = favoritosActuales.some(fav => fav.id === serie.id)
    
    if (!yaExiste) {
      favoritosActuales.push(serie)
      localStorage.setItem('favoritos', JSON.stringify(favoritosActuales))
    } else {
      alert('Ya está en favoritos')
    }
  }

  // FILTRAR series por búsqueda
  const seriesFiltradas = series.filter(serie =>
    //recorre el array y devuelve solo los elementos que cumplan la condición
    serie.name.toLowerCase().includes(busqueda.toLowerCase())
  )
    return (
    <div>
      <h2>Series de TV</h2>
      <div className="lista-series">
        {seriesFiltradas.map((serie) => (
          <div key={serie.id}>
            <h3>{serie.name}</h3>
            <p>Género: {serie.genres?.join(', ')}</p>
            <p>Idioma: {serie.language}</p>
            <img src={serie.image?.medium} alt={serie.name} />
            <button onClick={() => onClickSerie(serie)}>
              Ver detalles
            </button>
            <button onClick={(e) => agregarAFavoritos(serie, e)}>
              ❤️ Añadir a Favoritos
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Series