'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

// Componente para ver y editar una playlist de Spotify
export default function PlaylistDetailPage() {
  const id = useParams()?.id;
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  // Cargar datos de la playlist y favoritos al montar
  useEffect(() => {
    const fetchPlaylist = async () => {
      const token = getAccessToken();
      // Obtener info de la playlist
      const plRes = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const plData = await plRes.json();
      setPlaylist(plData);

      // Obtener canciones de la playlist
      const tracksRes = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tracksData = await tracksRes.json();
      setTracks(Array.isArray(tracksData.items) ? tracksData.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        image: item.track.album.images[0]?.url,
        uri: item.track.uri
      })) : []);
    };

    // Cargar favoritos de localStorage
    const favs = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    setFavoritos(favs.map(f => f.id));

    fetchPlaylist();
  }, [id]);

  // Marcar/desmarcar canción como favorita
  const toggleFav = (track) => {
    const favs = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    const existe = favs.find(f => f.id === track.id);
    const nuevos = existe ? favs.filter(f => f.id !== track.id) : [...favs, track];
    localStorage.setItem('favorite_tracks', JSON.stringify(nuevos));
    setFavoritos(nuevos.map(f => f.id));
  };

  // Eliminar canción de la playlist de Spotify
  const eliminarDePlaylist = async (trackUri) => {
    const token = getAccessToken();
    await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tracks: [{ uri: trackUri }]
      })
    });
    // Recargar canciones después de eliminar
    const tracksRes = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const tracksData = await tracksRes.json();
    setTracks(Array.isArray(tracksData.items) ? tracksData.items.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0].name,
      image: item.track.album.images[0]?.url,
      uri: item.track.uri
    })) : []);
  };

  // Añadir favoritos a la playlist, solo los que no estén ya
  const añadirFavoritos = async () => {
    const token = getAccessToken();
    const favs = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    const favUris = favs.map(t => t.uri || `spotify:track:${t.id}`);
    const playlistUris = tracks.map(t => t.uri);
    const nuevasUris = favUris.filter(uri => !playlistUris.includes(uri));
    // Añadir solo las nuevas URIs a la playlist en Spotify
    if (nuevasUris.length > 0) {
      await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ uris: nuevasUris })
      });
      // Recargar canciones después de añadir
      const tracksRes = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tracksData = await tracksRes.json();
      setTracks(Array.isArray(tracksData.items) ? tracksData.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        image: item.track.album.images[0]?.url,
        uri: item.track.uri
      })) : []);
    }
  };

  // Si aún no se ha cargado la playlist, mostramos "Cargando..."
  if (!playlist) return <div className="text-white p-8">Cargando...</div>;

  // Render de la página
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 p-8">
      {/* Cabecera con imagen y datos de la playlist */}
      <div className="flex gap-6 mb-8">
        <img
          src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : '/IMG/default-playlist.png'}
          alt={playlist.name}
          className="w-48 h-48 rounded-xl border-4 border-cyan-400/50"
        />
        <div>
          <h1 className="text-4xl font-bold text-cyan-300 mb-2">{playlist.name}</h1>
          <p className="text-white">{playlist.description}</p>
          <p className="text-cyan-300 mt-2">{tracks.length} canciones</p>
        </div>
      </div>

      {/* Botón para añadir favoritos a la playlist */}
      <button
        onClick={añadirFavoritos}
        className="px-6 py-3 bg-cyan-400 text-white font-semibold rounded-full hover:bg-yellow-300 hover:text-indigo-950 transition-all shadow-lg shadow-cyan-500/50 mb-8"
      >
        Añadir favoritos a esta playlist
      </button>

      {/* Lista de canciones de la playlist */}
      <div className="space-y-3">
        {tracks.map((track, i) => (
          <div key={track.id} className="flex items-center gap-4 bg-purple-900/40 p-4 rounded-2xl border-2 border-cyan-400/20">
            {/* Número de la canción */}
            <span className="text-cyan-300 w-8">{i + 1}</span>
            {/* Imagen del álbum */}
            <img src={track.image} alt={track.name} className="w-14 h-14 rounded-xl border-2 border-cyan-400/50" />
            {/* Info de la canción */}
            <div className="flex-1">
              <p className="text-white font-semibold">{track.name}</p>
              <p className="text-cyan-300 text-sm">{track.artist}</p>
            </div>
            {/* Botón para marcar/desmarcar como favorito */}
            <button
              onClick={() => toggleFav(track)}
              className="w-7 h-7 hover:scale-110 transition-transform"
              title={favoritos.includes(track.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <img
                src={favoritos.includes(track.id) ? '/IMG/amarilla.png' : '/IMG/gris.png'}
                alt="favorito"
                className="w-full h-full"
              />
            </button>
            {/* Botón para eliminar de la playlist de Spotify */}
            <button
              onClick={() => eliminarDePlaylist(track.uri)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-all"
              title="Quitar de playlist"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}