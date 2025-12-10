'use client';

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";
import Link from "next/link";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);

  // Cargar playlists del usuario desde Spotify
  const fetchPlaylists = async () => {
    const token = getAccessToken();
    const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPlaylists(Array.isArray(data.items) ? data.items : []);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-lg">Mis Playlists</h1>
        <div className="flex gap-4">
          <button 
            onClick={fetchPlaylists}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-500 transition-all shadow-lg"
          >
            Actualizar
          </button>
          <Link href="/dashboard/playlist/crearPlaylist">
            <button className="px-6 py-3 bg-yellow-400 text-indigo-950 font-semibold rounded-full hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-500/50">
              + Crear Playlist
            </button>
          </Link>
        </div>
      </div>
      {playlists.length === 0 ? (
        <div className="text-center py-16 bg-purple-900/20 backdrop-blur-sm rounded-3xl border-2 border-cyan-400/30">
          <p className="text-6xl mb-4">🎵</p>
          <p className="text-cyan-300 text-2xl mb-4 drop-shadow-md">No tienes playlists</p>
          <p className="text-white mb-6">Crea tu primera playlist y empieza a organizar tu música</p>
          <Link href="/dashboard/playlist/crearPlaylist">
            <button className="px-8 py-4 bg-cyan-400 text-white font-semibold rounded-full hover:bg-yellow-300 hover:text-indigo-950 transition-all shadow-lg shadow-cyan-500/50">
              Crear mi primera playlist
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {playlists.map(pl => (
            <Link key={pl.id} href={`/dashboard/playlist/${pl.id}`}>
              <div className="bg-purple-900/40 backdrop-blur-sm p-4 rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400 hover:scale-105 transition-all cursor-pointer shadow-lg">
                <img
                  src={pl.images && pl.images.length > 0 ? pl.images[0].url : '/IMG/default-playlist.png'}
                  alt={pl.name}
                  className="w-full aspect-square rounded-xl mb-2 border-2 border-cyan-400/50"
                />
                <p className="text-white font-semibold truncate drop-shadow-md">{pl.name}</p>
                <p className="text-cyan-300 text-sm drop-shadow-md">{pl.tracks.total} canciones</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}