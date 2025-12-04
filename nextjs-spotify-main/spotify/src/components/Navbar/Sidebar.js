'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-black p-4">
      <h1 className="text-2xl font-bold text-white mb-8">🎵 Spotify</h1>

      <nav className="space-y-2">
        {/* Home */}
        <Link 
          href="/dashboard"
          className={`flex items-center p-2 rounded-md transition-colors ${
            isActive('/dashboard') 
              ? 'bg-green-700 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Home
        </Link>  {/* ← CERRAR AQUÍ */}

        {/* Artistas */}
        <Link 
          href="/dashboard/artists"
          className={`flex items-center p-2 rounded-md transition-colors ${
            isActive('/dashboard/artists') 
              ? 'bg-green-700 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Artistas
        </Link>  {/* ← CERRAR AQUÍ */}

        {/* Tracks */}
        <Link 
          href="/dashboard/tracks"
          className={`flex items-center p-2 rounded-md transition-colors ${
            isActive('/dashboard/tracks') 
              ? 'bg-green-700 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Tracks
        </Link>  {/* ← CERRAR AQUÍ */}
      </nav>
    </div>
  );
}