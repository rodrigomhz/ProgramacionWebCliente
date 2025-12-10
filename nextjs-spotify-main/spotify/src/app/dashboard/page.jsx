'use client';

import { useState, useEffect } from "react";

// Lista de décadas para mostrar el label
const DECADES = [
  { value: 1950, label: "1950s" },
  { value: 1960, label: "1960s" },
  { value: 1970, label: "1970s" },
  { value: 1980, label: "1980s" },
  { value: 1990, label: "1990s" },
  { value: 2000, label: "2000s" },
  { value: 2010, label: "2010s" },
  { value: 2020, label: "2020s" }
];

export default function Dashboard() {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [favoriteDecades, setFavoriteDecades] = useState([]);
  const [popularity, setPopularity] = useState(50);

  useEffect(() => {
    const savedArtists = localStorage.getItem('favorite_artists');
    if (savedArtists) {
      setFavoriteArtists(JSON.parse(savedArtists));
    }

    const savedTracks = localStorage.getItem('favorite_tracks');
    if (savedTracks) {
      setFavoriteTracks(JSON.parse(savedTracks));
    }

    const savedGenres = localStorage.getItem('favorite_genres');
    if (savedGenres) {
      setFavoriteGenres(JSON.parse(savedGenres));
    }

    const savedDecades = localStorage.getItem('favorite_decades');
    if (savedDecades) {
      setFavoriteDecades(JSON.parse(savedDecades));
    }

    const savedPopularity = localStorage.getItem('popularity');
    if (savedPopularity) {
      setPopularity(Number(savedPopularity));
    }
  }, []);

  // Handler para el slider de popularidad
  const handlePopularity = (e) => {
    const value = Number(e.target.value);
    setPopularity(value);
    localStorage.setItem('popularity', value);
  };

  // Eliminar género favorito
  const removeGenre = (genre) => {
    const updated = favoriteGenres.filter(g => g !== genre);
    setFavoriteGenres(updated);
    localStorage.setItem('favorite_genres', JSON.stringify(updated));
  };

  // Eliminar década favorita
  const removeDecade = (decade) => {
    const updated = favoriteDecades.filter(d => d !== decade);
    setFavoriteDecades(updated);
    localStorage.setItem('favorite_decades', JSON.stringify(updated));
  };

  // Eliminar artista favorito
  const removeArtist = (id) => {
    const updated = favoriteArtists.filter(a => a.id !== id);
    setFavoriteArtists(updated);
    localStorage.setItem('favorite_artists', JSON.stringify(updated));
  };

  // Eliminar canción favorita
  const removeTrack = (id) => {
    const updated = favoriteTracks.filter(t => t.id !== id);
    setFavoriteTracks(updated);
    localStorage.setItem('favorite_tracks', JSON.stringify(updated));
  };

  return (
    <div 
      className="min-h-screen p-8 bg-cover bg-center bg-no-repeat" 
      style={{backgroundImage: "url('/IMG/estrella.jpg')"}}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-950/80 via-purple-900/80 to-blue-950/80 p-8 -m-8">
        <h1 className="text-4xl font-bold text-cyan-300 mb-12 tracking-wider flex items-center gap-3 drop-shadow-lg">
          <img src="/IMG/mario.png" alt="dashboard" className="w-10 h-10"/>
          DASHBOARD
        </h1>
        {/* Grid de widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Widget de géneros favoritos */}
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-3xl p-6 border-2 border-cyan-400/30 shadow-xl flex flex-col">
            <h2 className="text-xl text-yellow-300 mb-4 flex items-center gap-3 font-bold drop-shadow-md">
              <img src="/IMG/amarilla.png" alt="genres" className="w-8 h-8"/>
              Géneros favoritos
            </h2>
            {favoriteGenres.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 rounded-full bg-cyan-400/30 text-cyan-300 font-semibold border border-cyan-400/50 backdrop-blur-sm flex items-center gap-2"
                  >
                    {genre}
                    <button
                      onClick={() => removeGenre(genre)}
                      className="ml-2 text-red-400 hover:text-red-600 text-xs font-bold px-2"
                      title="Eliminar género"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-white">
                No tienes géneros favoritos.<br />
                Ve a <span className="text-yellow-300 font-bold">Géneros</span> para elegir.
              </p>
            )}
          </div>
          {/* Widget de décadas favoritas */}
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-3xl p-6 border-2 border-yellow-400/30 shadow-xl flex flex-col">
            <h2 className="text-xl text-yellow-300 mb-4 flex items-center gap-3 font-bold drop-shadow-md">
              <img src="/IMG/amarilla.png" alt="decades" className="w-8 h-8"/>
              Décadas favoritas
            </h2>
            {favoriteDecades.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {favoriteDecades.map((decade) => {
                  const label = DECADES.find(d => d.value === decade)?.label || decade;
                  return (
                    <span
                      key={decade}
                      className="px-4 py-2 rounded-full bg-cyan-400/30 text-cyan-300 font-semibold border border-cyan-400/50 backdrop-blur-sm flex items-center gap-2"
                    >
                      {label}
                      <button
                        onClick={() => removeDecade(decade)}
                        className="ml-2 text-red-400 hover:text-red-600 text-xs font-bold px-2"
                        title="Eliminar década"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-white">
                No tienes décadas favoritas.<br />
                Ve a <span className="text-yellow-300 font-bold">Décadas</span> para elegir.
              </p>
            )}
          </div>
          {/* Widget de popularidad */}
          <div className="bg-purple-900/30 backdrop-blur-lg rounded-3xl p-6 border-2 border-cyan-400/30 shadow-xl flex flex-col items-center">
            <h2 className="text-xl text-yellow-300 mb-4 flex items-center gap-3 font-bold drop-shadow-md">
              <img src="/IMG/amarilla.png" alt="popularity" className="w-8 h-8"/>
              Popularidad seleccionada
            </h2>
            <input
              type="range"
              min={0}
              max={100}
              value={popularity}
              onChange={handlePopularity}
              className="w-full accent-cyan-400"
            />
            <span className="text-cyan-300 font-mono mt-4 text-2xl">
              {popularity}
            </span>
          </div>
          {/* Widget de artistas favoritos */}
          <div className="bg-purple-900/30 backdrop-blur-lg rounded-3xl p-6 border-2 border-cyan-400/30 shadow-xl flex flex-col">
            <h2 className="text-xl text-yellow-300 mb-4 flex items-center gap-3 font-bold drop-shadow-md">
              <img src="/IMG/amarilla.png" alt="artists" className="w-8 h-8"/>
              Artistas favoritos
            </h2>
            {favoriteArtists.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {favoriteArtists.map((artist) => (
                  <div key={artist.id} className="text-center group relative">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full aspect-square object-cover rounded-full border-4 border-yellow-300 hover:border-cyan-400 transition-all shadow-lg"
                    />
                    <p className="text-white text-sm truncate mt-2 drop-shadow-md">{artist.name}</p>
                    <button
                      onClick={() => removeArtist(artist.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition"
                      title="Eliminar artista"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">
                No tienes artistas favoritos.<br />
                Ve a <span className="text-yellow-300 font-bold">Artistas</span> para elegir.
              </p>
            )}
          </div>
          {/* Widget de canciones favoritas */}
          <div className="bg-indigo-900/30 backdrop-blur-lg rounded-3xl p-6 border-2 border-yellow-400/30 shadow-xl flex flex-col">
            <h2 className="text-xl text-yellow-300 mb-4 flex items-center gap-3 font-bold drop-shadow-md">
              <img src="/IMG/amarilla.png" alt="tracks" className="w-8 h-8"/>
              Canciones favoritas
            </h2>
            {favoriteTracks.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {favoriteTracks.map((track) => (
                  <div key={track.id} className="text-center flex-shrink-0 w-32 group relative">
                    <img
                      src={track.image}
                      alt={track.name}
                      className="w-full aspect-square object-cover rounded-full border-4 border-yellow-400 hover:border-cyan-300 transition-all shadow-lg"
                    />
                    <p className="text-white text-sm truncate mt-2 drop-shadow-md">{track.name}</p>
                    <p className="text-cyan-300 text-xs truncate drop-shadow-md">{track.artist}</p>
                    <button
                      onClick={() => removeTrack(track.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition"
                      title="Eliminar canción"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">
                No tienes canciones favoritas.<br />
                Ve a <span className="text-yellow-300 font-bold">Tracks</span> para elegir.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}