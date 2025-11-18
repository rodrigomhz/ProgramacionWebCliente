function ModalDetalle({ serie, onCerrar }) {
  return (
    <div className="modal">
      <div className="modal-contenido">
        <h2>{serie.name}</h2>
        <img src={serie.image?.original} alt={serie.name} />
        <p><strong>Géneros:</strong> {serie.genres?.join(', ')}</p>
        <p><strong>Idioma:</strong> {serie.language}</p>
        <p><strong>Puntuación:</strong> {serie.rating?.average}</p>
        <div dangerouslySetInnerHTML={{__html: serie.summary}} />
        <button onClick={onCerrar}>Cerrar X</button>
      </div>
    </div>
  )
}

export default ModalDetalle