'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

// Filtra canciones por popularidad mínima
function filterByPopularity(tracks, minPopularity) {
  return tracks.filter(track => track.popularity >= minPopularity);
}

// Mezcla el array de canciones
function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function PlaylistDisplay() {
  const [playlist, setPlaylist] = useState([]);
  const [nombrePlaylist, setNombrePlaylist] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [generatingPlaylist, setGeneratingPlaylist] = useState(false);
  const router = useRouter();

  // Selecciones del usuario
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectedPopularity, setSelectedPopularity] = useState(50);

  useEffect(() => {
    setSelectedArtists(JSON.parse(localStorage.getItem('favorite_artists') || '[]'));
    setSelectedGenres(JSON.parse(localStorage.getItem('favorite_genres') || '[]'));
    setSelectedDecades(JSON.parse(localStorage.getItem('favorite_decades') || '[]'));
    setSelectedTracks(JSON.parse(localStorage.getItem('favorite_tracks') || '[]'));
    const pop = localStorage.getItem('popularity');
    setSelectedPopularity(pop ? Number(pop) : 50);
  }, []);

  // Genera la playlist combinando todos los filtros y favoritas
  const generatePlaylist = async (addMore = false) => {
    const token = getAccessToken();
    if (!token) return;

    setGeneratingPlaylist(true);

    try {
      let allTracks = addMore ? [...playlist] : [];
      const existingIds = new Set(allTracks.map(t => t.id));

      const queries = [];

      selectedArtists.forEach(artist => {
        queries.push(`artist:${artist.name}`);
      });

      selectedGenres.forEach(genre => {
        queries.push(`genre:${genre}`);
      });

      selectedDecades.forEach(decade => {
        // Si tienes start/end, usa eso. Si solo tienes el año, ajusta aquí.
        queries.push(`year:${decade}-${decade + 9}`);
      });

      if (queries.length === 0) {
        queries.push('top hits');
      }

      for (const query of queries.slice(0, 5)) {
        if (!query) continue;

        const response = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&limit=10`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const newTracks = data.tracks.items.filter(t => !existingIds.has(t.id));
          const filteredTracks = filterByPopularity(newTracks, selectedPopularity);

          filteredTracks.forEach(track => {
            if (!existingIds.has(track.id)) {
              existingIds.add(track.id);
              allTracks.push({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                image: track.album.images[0]?.url,
                uri: track.uri,
                popularity: track.popularity
              });
            }
          });
        }
      }

      // Añade las canciones favoritas seleccionadas
      selectedTracks.forEach(track => {
        if (!existingIds.has(track.id)) {
          existingIds.add(track.id);
          allTracks.push(track);
        }
      });

      allTracks = shuffleArray(allTracks).slice(0, 30);

      setPlaylist(allTracks);
    } catch (err) {
      console.error('Error generando la playlist:', err);
      alert('Error generando la playlist');
    } finally {
      setGeneratingPlaylist(false);
    }
  };

  // Eliminar canción de la playlist local
  const eliminarDePlaylist = (id) => {
    setPlaylist(prev => prev.filter(t => t.id !== id));
  };

  // Guardar en Spotify y redirigir al detalle
  const guardarEnSpotify = async () => {
    if (playlist.length === 0) return alert('Playlist vacía');
    if (!nombrePlaylist.trim()) return alert('Escribe un nombre para la playlist');
    setGuardando(true);
    try {
      const token = getAccessToken();
      const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = await userRes.json();
      const createRes = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nombrePlaylist, public: false })
      });
      const pl = await createRes.json();
      const uris = playlist.map(t => t.uri).filter(Boolean);
      await fetch(`https://api.spotify.com/v1/playlists/${pl.id}/tracks`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ uris })
      });
      router.push(`/dashboard/playlist/${pl.id}`);
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // Render
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/IMG/estrella.jpg')" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 p-8 -m-8">
        <h1 className="text-4xl font-bold text-cyan-300 mb-8">Crear Playlist personalizada</h1>
        <input
          type="text"
          value={nombrePlaylist}
          onChange={e => setNombrePlaylist(e.target.value)}
          placeholder="Nombre de la playlist"
          className="mb-4 px-4 py-3 rounded-full bg-purple-900/50 text-white border-2 border-cyan-400/30 w-full max-w-md"
        />
        <button
          onClick={() => generatePlaylist(false)}
          disabled={generatingPlaylist}
          className="px-6 py-3 bg-cyan-400 text-white font-semibold rounded-full hover:bg-yellow-300 transition-all shadow-lg shadow-cyan-500/50 mb-4"
        >
          {generatingPlaylist ? 'Generando...' : 'Generar playlist con mis selecciones'}
        </button>
        <button
          onClick={guardarEnSpotify}
          disabled={guardando}
          className="px-6 py-3 bg-yellow-400 text-indigo-950 font-semibold rounded-full hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-500/50 mb-8"
        >
          {guardando ? 'Guardando...' : 'Guardar en Spotify'}
        </button>
        {playlist.length === 0 ? (
          <div className="text-cyan-300 text-center py-12 bg-purple-900/20 rounded-3xl border-2 border-cyan-400/30">
            <p className="text-6xl mb-4">♪</p>
            <p className="text-lg">No hay canciones en la playlist</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlist.map((track, i) => (
              <div key={track.id} className="flex flex-col items-center bg-purple-900/40 rounded-2xl p-4 border-2 border-cyan-400/20 shadow-lg hover:scale-105 transition-all">
                <span className="text-cyan-300 font-mono mb-2">{i + 1}</span>
                <img src={track.image} alt={track.name} className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg mb-3" />
                <p className="text-white text-base font-semibold text-center truncate">{track.name}</p>
                <p className="text-cyan-300 text-xs text-center truncate">{track.artist}</p>
                <span className="text-yellow-300 text-xs mt-1">Popularidad: {track.popularity}</span>
                <button
                  onClick={() => eliminarDePlaylist(track.id)}
                  className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-all"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}