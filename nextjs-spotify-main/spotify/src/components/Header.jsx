'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  
  // Estados para almacenar información
  const [buscar, setBuscar] = useState('');          // Texto del buscador
  const [resultados, setResultados] = useState([]);  // Canciones encontradas
  const [mostrar, setMostrar] = useState(false);     // Mostrar u ocultar resultados
  const [usuario, setUsuario] = useState(null);      // Info del usuario logueado

  // Se ejecuta cuando carga el componente para obtener info del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      const token = getAccessToken();
      if (!token) return;

      // Petición para obtener los datos del usuario actual
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuario(data);
    };

    fetchUsuario();
  }, []);

  // Se ejecuta cada vez que cambia el texto del buscador
  useEffect(() => {
    // Si el buscador está vacío, limpia los resultados
    if (!buscar.trim()) {
      setResultados([]);
      setMostrar(false);
      return;
    }

    // Espera 300ms después de que el usuario deje de escribir
    const timer = setTimeout(() => {
      fetchCanciones(buscar);
    }, 300);

    // Limpia el timer si el usuario sigue escribiendo
    return () => clearTimeout(timer);
  }, [buscar]);

  // Función para buscar canciones en Spotify
  const fetchCanciones = async (query) => {
    const token = getAccessToken();
    if (!token) return;

    // Petición a la API de Spotify para buscar canciones
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    
    // Mapea los resultados para quedarnos solo con lo que necesitamos
    const canciones = (data.tracks?.items || []).map(t => ({
      id: t.id,
      nombre: t.name,
      artista: t.artists[0]?.name,
      img: t.album?.images?.[0]?.url
    }));
    
    setResultados(canciones);
    setMostrar(canciones.length > 0);
  };

  // Función cuando haces click en una canción de los resultados
  const handleClick = (cancionId) => {
    setMostrar(false);           // Oculta los resultados
    setBuscar('');               // Limpia el buscador
    setResultados([]);           // Limpia los resultados
    router.push(`/dashboard/tracks/${cancionId}`);  // Navega a la página de la canción
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gradient-to-r from-indigo-950/90 via-purple-900/90 to-blue-950/90 backdrop-blur-md border-b-2 border-cyan-400/30 px-6 flex items-center justify-between z-10 shadow-lg">
      
      {/* Buscador de canciones */}
      <div className="flex-1 max-w-md relative">
        <input
          type="text"
          placeholder="Buscar canciones..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          onFocus={() => buscar.trim() && setMostrar(true)}
          onBlur={() => setTimeout(() => setMostrar(false), 200)}
          className="w-full px-4 py-2 rounded-full bg-purple-900/50 backdrop-blur-sm text-white placeholder-cyan-300/50 border-2 border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all"
        />

        {/* Dropdown con resultados de búsqueda */}
        {mostrar && resultados.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-indigo-950/95 backdrop-blur-md rounded-xl shadow-2xl shadow-cyan-500/30 border-2 border-cyan-400/30 max-h-96 overflow-y-auto z-50">
            {resultados.map((cancion, i) => (
              <div
                key={i}
                onClick={() => handleClick(cancion.id)}
                className="flex items-center gap-3 p-3 hover:bg-purple-800/50 cursor-pointer transition-all border-b border-cyan-400/10 last:border-b-0"
              >
                {/* Imagen del álbum */}
                <img src={cancion.img} alt="" className="w-12 h-12 rounded-lg object-cover border-2 border-cyan-400/50" />
                <div>
                  {/* Nombre de la canción */}
                  <p className="text-white font-medium">{cancion.nombre}</p>
                  {/* Nombre del artista */}
                  <p className="text-cyan-300 text-xs">{cancion.artista}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Foto de perfil del usuario */}
      <div className="flex items-center gap-4">
        {usuario?.images?.[0]?.url && (
          <img 
            src={usuario.images[0].url}
            alt={usuario.display_name}
            className="w-12 h-12 rounded-full object-cover cursor-pointer border-4 border-cyan-400 hover:border-yellow-300 hover:scale-110 transition-all shadow-lg shadow-cyan-500/50"
          />
        )}
      </div>
      
    </header>
  );
}