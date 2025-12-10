'use client';

import { useEffect, useState, useRef } from 'react';
import { getAccessToken } from '@/lib/auth';

// ID de la canción especial (Dragon Ball Rap 1.5 de Porta)
const DRAGON_BALL_TRACK_ID = '59zPfFTQRSctgl4Tz07ZjJ';

export default function TrackCard({ trackId }) {
  // Estado para guardar la información de la canción y el artista
  const [track, setTrack] = useState(null);
  const [artist, setArtist] = useState(null);

  // Referencia al audio especial (solo para Dragon Ball Rap)
  const dragonBallAudioRef = useRef(null);

  // Estado para saber si el audio especial está sonando
  const [isPlaying, setIsPlaying] = useState(false);

  // Estado para saber si la canción está en favoritos
  const [isFavorite, setIsFavorite] = useState(false);

  // Al entrar en la tarjeta, pausamos la música de fondo general (sidebar)
  useEffect(() => {
    const sidebarAudio = document.querySelector('audio[src="/song.mp3"]');
    if (sidebarAudio) sidebarAudio.pause();

    // Al salir de la tarjeta, reanudamos la música de fondo y paramos el audio especial si estaba sonando
    return () => {
      if (sidebarAudio) sidebarAudio.play();
      if (dragonBallAudioRef.current) {
        dragonBallAudioRef.current.pause();
        dragonBallAudioRef.current.currentTime = 0;
      }
    };
  }, [trackId]);

  // Al montar o cambiar de canción, pedimos los datos a la API de Spotify
  useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken();
      // Pedimos los datos de la canción
      const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const trackData = await trackRes.json();
      setTrack(trackData);

      // Pedimos los datos del artista principal
      const artistId = trackData.artists?.[0]?.id;
      if (artistId) {
        const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const artistData = await artistRes.json();
        setArtist(artistData);
      }
    };

    fetchData();
  }, [trackId]);

  // Comprobar si la canción está en favoritos al montar/cambiar
  useEffect(() => {
    if (!track) return;
    const favs = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    setIsFavorite(favs.some(f => f.id === track.id));
  }, [track]);

  // Calculamos la duración en minutos y segundos
  const duracion = track
    ? `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}`
    : '';

  // Cuando se pulsa play, si es la canción especial, reproducimos el audio local
  const handlePlay = () => {
    if (trackId === DRAGON_BALL_TRACK_ID && dragonBallAudioRef.current) {
      dragonBallAudioRef.current.currentTime = 0;
      dragonBallAudioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Cuando se pulsa pause, paramos el audio especial
  const handlePause = () => {
    if (trackId === DRAGON_BALL_TRACK_ID && dragonBallAudioRef.current) {
      dragonBallAudioRef.current.pause();
      dragonBallAudioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Añadir/quitar canción de favoritos en localStorage
  const toggleFavorite = () => {
    if (!track) return;
    const favs = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    const exists = favs.some(f => f.id === track.id);
    let updated;
    if (exists) {
      updated = favs.filter(f => f.id !== track.id);
      setIsFavorite(false);
    } else {
      updated = [...favs, {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        image: track.album.images[0]?.url,
        uri: track.uri,
        popularity: track.popularity
      }];
      setIsFavorite(true);
    }
    localStorage.setItem('favorite_tracks', JSON.stringify(updated));
  };

  // Si aún no tenemos datos de la canción, no mostramos nada
  if (!track) return null;

  // FONDO IGUAL QUE EN EL DASHBOARD: imagen de estrella y gradiente encima
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/IMG/estrella.jpg')" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-950/80 via-purple-900/80 to-blue-950/80 p-8 -m-8">
        {/* Audio especial solo para Dragon Ball Rap */}
        {trackId === DRAGON_BALL_TRACK_ID && (
          <audio ref={dragonBallAudioRef} src="/dragon.mp3" />
        )}

        {/* Tarjeta principal de la canción */}
        <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-6 sm:p-8 mb-8 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Imagen del álbum */}
            <img
              src={track.album?.images?.[0]?.url}
              alt={track.name}
              className="w-full sm:w-64 md:w-64 lg:w-72 h-64 rounded-2xl border-4 border-cyan-400 shadow-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-cyan-300 text-sm uppercase mb-2">Canción</p>
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{track.name}</h1>
              <div className="text-cyan-200 text-sm mb-4">
                <span>{track.artists?.map(a => a.name).join(', ')}</span>
                <span> • </span>
                <span>{track.album?.name}</span>
                <span> • </span>
                <span>{track.album?.release_date?.split('-')[0]}</span>
                <span> • </span>
                <span>{duracion}</span>
              </div>
              {/* Botón para añadir/quitar de favoritos */}
              <button
                onClick={toggleFavorite}
                className={`mb-4 px-4 py-2 rounded-full font-semibold transition-all shadow-lg ${
                  isFavorite
                    ? "bg-yellow-400 text-indigo-950 hover:bg-yellow-300"
                    : "bg-cyan-400 text-white hover:bg-yellow-300"
                }`}
              >
                {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              </button>
              {/* Barra de reproducción: siempre visible, pero solo funcional para Dragon Ball Rap */}
              <div className="bg-purple-800/60 rounded-xl p-6 mt-4">
                <div className="flex justify-center items-center gap-6 mb-4">
                  {/* Botón anterior (decorativo) */}
                  <button className="text-cyan-400 hover:text-yellow-300 transition text-2xl">
                    <span>◄◄</span>
                  </button>
                  {/* Botón play/pause: solo reproduce el audio especial si es Dragon Ball Rap */}
                  {trackId === DRAGON_BALL_TRACK_ID ? (
                    isPlaying ? (
                      <button
                        onClick={handlePause}
                        className="bg-red-500 hover:bg-red-400 text-white rounded-full w-14 h-14 flex items-center justify-center transition text-3xl font-bold"
                      >
                        ❚❚
                      </button>
                    ) : (
                      <button
                        onClick={handlePlay}
                        className="bg-cyan-400 hover:bg-yellow-300 text-indigo-950 rounded-full w-14 h-14 flex items-center justify-center transition text-3xl font-bold"
                      >
                        ▶
                      </button>
                    )
                  ) : (
                    // Para el resto de canciones, el botón está deshabilitado y solo es decorativo
                    <button
                      className="bg-cyan-400 text-indigo-950 rounded-full w-14 h-14 flex items-center justify-center text-3xl font-bold opacity-60 cursor-not-allowed"
                      disabled
                    >
                      ▶
                    </button>
                  )}
                  {/* Botón siguiente (decorativo) */}
                  <button className="text-cyan-400 hover:text-yellow-300 transition text-2xl">
                    <span>►►</span>
                  </button>
                </div>
                {/* Barra de progreso (decorativa, no funcional) */}
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 text-xs font-mono">0:00</span>
                  <div className="flex-1 bg-cyan-900 rounded-full h-1.5 cursor-pointer group">
                    <div className="bg-cyan-400 h-full rounded-full w-0 group-hover:bg-yellow-300 transition"></div>
                  </div>
                  <span className="text-cyan-400 text-xs font-mono">{duracion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información del artista principal */}
        {artist && (
          <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 mb-8 border-2 border-yellow-400/30 shadow-2xl shadow-yellow-500/20">
            <h2 className="text-yellow-300 text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sobre el artista</h2>
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              {/* Imagen del artista */}
              <img
                src={artist.images?.[0]?.url}
                alt={artist.name}
                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full mx-auto md:mx-0 border-4 border-yellow-300 shadow-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center md:text-left">{artist.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-cyan-400 text-xs sm:text-sm">Seguidores</p>
                    <p className="text-white text-lg sm:text-xl font-bold">{artist.followers?.total.toLocaleString()}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-cyan-400 text-xs sm:text-sm">Popularidad</p>
                    <p className="text-white text-lg sm:text-xl font-bold">{artist.popularity}/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}