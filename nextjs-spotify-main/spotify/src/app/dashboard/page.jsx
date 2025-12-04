'use client';

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [favoriteTracks, setFavoriteTracks] = useState([]);

  // Cargar favoritos
  useEffect(() => {
    const savedArtists = localStorage.getItem('favorite_artists');
    if (savedArtists) {
      setFavoriteArtists(JSON.parse(savedArtists));
    }

    const savedTracks = localStorage.getItem('favorite_songs');
    if (savedTracks) {
      setFavoriteTracks(JSON.parse(savedTracks));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-8">
      <h1 className="text-4xl font-bold text-white mb-8">🎵 Dashboard</h1>
      
      {/* Artistas Favoritos */}
      {favoriteArtists.length > 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl text-white mb-4">⭐ Tus Artistas Favoritos</h2>
          <div className="grid grid-cols-5 gap-4">
            {favoriteArtists.map((artist) => (
              <div key={artist.id} className="text-center">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full aspect-square object-cover rounded-full mb-2"
                />
                <p className="text-white text-sm truncate">{artist.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
          <p className="text-gray-400">
            No tienes artistas favoritos. Ve a <span className="text-green-400">Artistas</span> para elegir.
          </p>
        </div>
      )}

      {/* Canciones Favoritas */}
      {favoriteTracks.length > 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl text-white mb-4">🎶 Tus Canciones Favoritas</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {favoriteTracks.map((track) => (
              <div key={track.id} className="text-center flex-shrink-0 w-32">
                <img
                  src={track.image}
                  alt={track.name}
                  className="w-full aspect-square object-cover rounded-lg mb-2"
                />
                <p className="text-white text-sm truncate">{track.name}</p>
                <p className="text-gray-400 text-xs truncate">{track.artist}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400">
            No tienes canciones favoritas. Ve a <span className="text-green-400">Tracks</span> para elegir.
          </p>
        </div>
      )}
    </div>
  );
}