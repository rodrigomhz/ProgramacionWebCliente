// Recibe: artists (lista de Spotify), selectedItems (los elegidos), onSelect (función al clickear)
const ArtistWidget = ({ artists, selectedItems = [], onSelect }) => {

    // Cuando clickeas una tarjeta, avisa al padre
    const handleClick = (artist) => {
        if (onSelect) {
            onSelect(artist); // Llama a handleArtistSelect en page.jsx
        }
    };

    // Comprueba si un artista está seleccionado
    const isSelected = (artistId) => {
        return selectedItems.some(item => item.id === artistId); // true o false
    };

    return (
        <div className="artist-grid">
            {artists.map((artist) => (
                <div
                    key={artist.id}
                    className={`artist-card ${isSelected(artist.id) ? 'selected' : ''}`} // Agrega clase si está seleccionado
            //                                  ↑
            //                        ¿Está seleccionado?
            //                        Sí → "artist-card selected" (se ve diferente)
            //                        No → "artist-card" (normal)
                    onClick={() => handleClick(artist)}
                >
                    <img src={artist.image} alt={artist.name} />
                    <span>{artist.name}</span>
                </div>
            ))}
        </div>
    );
};

export default ArtistWidget;