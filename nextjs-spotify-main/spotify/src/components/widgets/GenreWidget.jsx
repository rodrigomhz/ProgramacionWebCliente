'use client';

// Widget para seleccionar géneros musicales disponibles
import { useState, useEffect } from "react";

// Lista de géneros musicales (hardcodeada)
const GENRES = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical', 'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 'french', 'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm', 'indian', 'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party', 'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter', 'soul', 'soundtracks', 'spanish', 'study', 'summer', 'swedish', 'synth-pop', 'tango', 'techno', 'trance', 'trip-hop', 'turkish', 'work-out', 'world-music'
];

export default function GenreWidget() {
  // Estado para géneros seleccionados
  const [selected, setSelected] = useState([]);

  // Al montar, cargar géneros favoritos guardados en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorite_genres');
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  // Añadir o quitar género de la selección y guardar en localStorage
  const toggleGenre = (genre) => {
    setSelected(prev => {
      const updated = prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre];
      localStorage.setItem('favorite_genres', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/IMG/estrella.jpg')" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-950/80 via-purple-900/80 to-blue-950/80 p-8 -m-8">
        {/* Título */}
        <h1 className="text-4xl font-bold text-cyan-300 mb-8">Géneros musicales</h1>

        {/* Lista de géneros */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-4 py-2 rounded-full font-semibold transition-all
                ${selected.includes(genre)
                  ? "bg-cyan-400 text-white border-2 border-yellow-300 shadow-lg"
                  : "bg-purple-900/40 text-cyan-300 border-2 border-cyan-400/30 hover:bg-purple-800/50"}
              `}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}