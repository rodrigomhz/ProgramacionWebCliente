'use client';

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

export default function ArtistWidget() {
  // 1º ESTADOS = Cajas donde guardas cosas
  const [artists, setArtists] = useState([]);     // 📦 Lista de artistas encontrados
  const [selected, setSelected] = useState([]);    // 📦 Tus favoritos
  const [buscar, setBuscar] = useState("");        // 📦 Lo que escribes

  // 2º useEffect = Hace algo AUTOMÁTICO
  useEffect(() => {
    // Esto pasa cuando la página carga
    const saved = localStorage.getItem('favorite_artists');
    if (saved) {
      setSelected(JSON.parse(saved));
    }
  }, []);

  // Cargar artistas al inicio
  useEffect(() => {
    fetchArtists("genre:metal");
  }, []);

  //Buscar mientras escribes
  useEffect(() => {
    // Esto pasa cada vez que "buscar" cambia
    if (!buscar) {
      fetchArtists("genre:metal");
      return;
    }

    const timer = setTimeout(() => {
      fetchArtists(buscar);
    }, 200);

    return () => clearTimeout(timer);
  }, [buscar]);


  // 3º fetchArtists = Pregunta a Spotify
  const fetchArtists = async (query) => {
    // 🔑 Coge la llave
    const token = getAccessToken();
    if (!token) return;

    // 📡 Pregunta a Spotify: "Dame artistas de: query"
    const res = await fetch(`https://api.spotify.com/v1/search?type=artist&q=${query}&limit=8`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    if (!data.artists?.items) return;

    setArtists(data.artists.items.map((a) => ({
      id: a.id,
      name: a.name,
      image: a.images?.[0]?.url || "/default-image.jpg",
    })));
  };

  // 4º toggleSelect = Click en un artista
  const toggleSelect = (artist) => {
    setSelected((prev) => {
      let newSelected;

      // ¿Ya lo tienes?
      if (prev.find((a) => a.id === artist.id)) {
        // SÍ → Quitarlo
        newSelected = prev.filter((a) => a.id !== artist.id);
      // ¿Ya tienes 5?
      } else if (prev.length >= 5) {
        return prev;// No hacer nada
      } else {
        newSelected = [...prev, artist];
      }

      // Guardar en localStorage
      localStorage.setItem('favorite_artists', JSON.stringify(newSelected));
      return newSelected;
    });
  };

  return (
    <div>
      {/* Buscador */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar artista..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="flex-1 max-w-md px-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => fetchArtists(buscar)}
          className="px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400"
        >
          Buscar
        </button>
      </div>

      {/* Artistas */}
      <div className="grid grid-cols-4 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => toggleSelect(artist)}
            className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-105 ${
              selected.find((s) => s.id === artist.id)
                ? "bg-green-600 ring-2 ring-green-400"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full aspect-square object-cover rounded-lg mb-2"
            />
            <p className="text-white text-center text-sm truncate">{artist.name}</p>
          </div>
        ))}
      </div>

      {/* Favoritos seleccionados */}
      {selected.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
          <h3 className="text-white font-bold mb-3">⭐ Favoritos ({selected.length}/5)</h3>
          <div className="flex flex-wrap gap-2">
            {selected.map((a) => (
              <span key={a.id} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                {a.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}