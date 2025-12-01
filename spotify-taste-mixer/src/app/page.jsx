"use client";
import { useState, useEffect } from "react";
import ArtistWidget from "../components/widgets/ArtistWidget";

export default function Home() {
  // === ESTADOS ===
  const [selectedArtists, setSelectedArtists] = useState([]); // Artistas seleccionados por el usuario
  const [artistList, setArtistList] = useState([]);           // Resultados de Spotify
  const [searchQuery, setSearchQuery] = useState("");         // Texto del buscador

  // === BUSCAR ARTISTAS EN SPOTIFY ===
  const searchArtists = async (query) => {
    if (!query) return; // Si no hay texto, no buscar

    const token = "TU_TOKEN_DE_SPOTIFY";
    const url = `https://api.spotify.com/v1/search?type=artist&q=${query}&limit=5`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    // Transformar datos de Spotify → solo id, name, image
    const artists = data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images[0]?.url || "/default-image.jpg",
    }));

    setArtistList(artists); // Guardar resultados
  };

  // === SELECCIONAR/DESELECCIONAR ARTISTA ===
  const handleArtistSelect = (artist) => {
    setSelectedArtists((prev) => {
      const exists = prev.find((p) => p.id === artist.id); // ¿Ya está seleccionado?
      if (exists) {
        return prev.filter((p) => p.id !== artist.id);     // Sí → quitar
      }
      return [...prev, artist];                            // No → agregar
    });
  };

  // === LO QUE SE VE ===
  return (
    <div>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar artista..."
        value={searchQuery}                              // Muestra el texto actual
        onChange={(e) => setSearchQuery(e.target.value)} // Actualiza al escribir
      />
      <button onClick={() => searchArtists(searchQuery)}>Buscar</button>

      {/* Tarjetas de artistas */}
      <ArtistWidget
        artists={artistList}              // Los que vienen de Spotify
        selectedItems={selectedArtists}   // Los que el usuario eligió
        onSelect={handleArtistSelect}     // Función al clickear
      />
    </div>
  );
}