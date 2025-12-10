'use client';

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

// Componente para buscar y seleccionar canciones favoritas
export default function TrackWidget() {
  // Estado para las canciones encontradas
  const [tracks, setTracks] = useState([]);
  // Estado para las canciones favoritas seleccionadas
  const [selected, setSelected] = useState([]);
  // Estado para el texto de búsqueda
  const [buscar, setBuscar] = useState("");

  // Al montar, cargar favoritos guardados en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorite_tracks');
    if (saved) {
      setSelected(JSON.parse(saved));
    }
  }, []);

  // Al montar, buscar canciones por defecto (metal)
  useEffect(() => {
    fetchTracks("genre:metal");
  }, []);

  // Buscar canciones cuando cambia el texto de búsqueda
  useEffect(() => {
    if (!buscar) {
      fetchTracks("genre:metal");
      return;
    }
    const timer = setTimeout(() => {
      fetchTracks(buscar);
    }, 300);
    return () => clearTimeout(timer);
  }, [buscar]);

  // Buscar canciones en Spotify según el texto
  const fetchTracks = async (query) => {
    const token = getAccessToken();
    if (!token) return;
    const res = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${query}&limit=20`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!data.tracks?.items) return;
    setTracks(
      data.tracks.items.map((t) => ({
        id: t.id,
        name: t.name,
        artist: t.artists[0].name,
        image: t.album.images[0]?.url,
        uri: t.uri
      }))
    );
  };

  // Añadir o quitar canción de favoritos
  const toggleSelect = (track) => {
    setSelected((prev) => {
      let newSelected;
      if (prev.find((a) => a.id === track.id)) {
        newSelected = prev.filter((a) => a.id !== track.id);
      } else {
        newSelected = [...prev, {
          id: track.id,
          name: track.name,
          artist: track.artist,
          image: track.image,
          uri: track.uri
        }];
      }
      localStorage.setItem('favorite_tracks', JSON.stringify(newSelected));
      return newSelected;
    });
  };

  return (
    // Fondo igual que dashboard: imagen y degradado
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/IMG/estrella.jpg')" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-950/80 via-purple-900/80 to-blue-950/80 p-8 -m-8">
        {/* Título */}
        <h1 className="text-4xl font-bold text-cyan-300 mb-8">Tracks</h1>

        {/* Buscador de canciones */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar canción..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="flex-1 max-w-md px-4 py-3 rounded-full bg-purple-900/50 backdrop-blur-sm text-white placeholder-cyan-300/50 border-2 border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all"
          />
          <button
            onClick={() => fetchTracks(buscar)}
            className="px-6 py-3 bg-cyan-400 text-white font-semibold rounded-full hover:bg-yellow-300 hover:text-indigo-950 transition-all shadow-lg shadow-cyan-500/50"
          >
            Buscar
          </button>
        </div>

        {/* Lista de canciones encontradas */}
        <div className="grid grid-cols-4 gap-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => toggleSelect(track)}
              className={`p-4 rounded-3xl cursor-pointer transition-all hover:scale-105 ${
                selected.find((s) => s.id === track.id)
                  ? "bg-cyan-400/80 ring-4 ring-yellow-300 shadow-xl shadow-cyan-500/50"
                  : "bg-purple-900/40 backdrop-blur-sm hover:bg-purple-800/50 border-2 border-cyan-400/30"
              }`}
            >
              <img
                src={track.image}
                alt={track.name}
                className="w-full aspect-square object-cover rounded-xl mb-2 border-4 border-cyan-400 shadow-lg"
              />
              <p className="text-white text-sm font-semibold truncate drop-shadow-md">{track.name}</p>
              <p className="text-cyan-300 text-xs truncate drop-shadow-md">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}