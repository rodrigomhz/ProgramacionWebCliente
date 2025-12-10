'use client';

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

// Componente para buscar y seleccionar artistas favoritos
export default function ArtistWidget() {
  // Estado para los artistas encontrados
  const [artists, setArtists] = useState([]);
  // Estado para los artistas favoritos seleccionados
  const [selected, setSelected] = useState([]);
  // Estado para el texto de búsqueda
  const [search, setSearch] = useState("");

  // Al montar, cargar favoritos guardados en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorite_artists');
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  // Al montar, buscar artistas de ejemplo (rock)
  useEffect(() => {
    fetchArtists("genre:rock");
  }, []);

  // Buscar artistas en Spotify cuando cambia el texto de búsqueda
  useEffect(() => {
    if (!search) {
      fetchArtists("genre:rock");
      return;
    }
    const timer = setTimeout(() => {
      fetchArtists(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Buscar artistas en Spotify según el texto
  const fetchArtists = async (query) => {
    const token = getAccessToken();
    if (!token) return;
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=20`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setArtists(Array.isArray(data.artists?.items) ? data.artists.items : []);
  };

  // Añadir o quitar artista de favoritos
  const toggleSelect = (artist) => {
    setSelected((prev) => {
      let newSelected;
      if (prev.find((a) => a.id === artist.id)) {
        newSelected = prev.filter((a) => a.id !== artist.id);
      } else {
        newSelected = [...prev, {
          id: artist.id,
          name: artist.name,
          image: artist.images && artist.images.length > 0 ? artist.images[0].url : '/IMG/default-playlist.png'
        }];
      }
      localStorage.setItem('favorite_artists', JSON.stringify(newSelected));
      return newSelected;
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/IMG/estrella.jpg')" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-950/80 via-purple-900/80 to-blue-950/80 p-8 -m-8">
        {/* Título */}
        <h1 className="text-4xl font-bold text-cyan-300 mb-8">Artistas</h1>

        {/* Buscador de artistas */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar artista en Spotify"
          className="mb-6 px-4 py-3 rounded-full bg-purple-900/50 text-white border-2 border-cyan-400/30 w-full max-w-md"
        />

        {/* Lista de artistas encontrados */}
        <div className="grid grid-cols-5 gap-6 mb-12">
          {artists.map(artist => (
            <div
              key={artist.id}
              onClick={() => toggleSelect(artist)}
              className={`text-center group cursor-pointer transition-all hover:scale-105 ${
                selected.find(a => a.id === artist.id)
                  ? "bg-cyan-400/80 ring-4 ring-yellow-300 shadow-xl shadow-cyan-500/50"
                  : "bg-purple-900/40 backdrop-blur-sm hover:bg-purple-800/50 border-2 border-cyan-400/30"
              } p-4 rounded-3xl`}
            >
              <img
                src={artist.images && artist.images.length > 0 ? artist.images[0].url : '/IMG/default-playlist.png'}
                alt={artist.name}
                className="w-full aspect-square object-cover rounded-full border-4 border-cyan-400 shadow-lg"
              />
              <p className="text-white text-sm truncate mt-2">{artist.name}</p>
              <span className="block mt-2 text-xs text-cyan-300">
                {selected.find(a => a.id === artist.id) ? 'Seleccionado' : 'Click para seleccionar'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}