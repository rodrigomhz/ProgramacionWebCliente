'use client';

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

export default function TrackWidget() {
    // 1º ESTADOS
    const [tracks, setTracks] = useState([]);        // ← tracks, no artists
    const [selected, setSelected] = useState([]);
    const [buscar, setBuscar] = useState("");

    // 2º Cargar favoritos guardados
    useEffect(() => {
        const saved = localStorage.getItem('favorite_songs');
        if(saved){
            setSelected(JSON.parse(saved));
        }
    }, []);

    // Cargar canciones al inicio
    useEffect(() => {
        fetchSongs("genre:metal");
    }, []);

    // Buscar mientras escribes
    useEffect(() => {
        if (!buscar) {
            fetchSongs("genre:metal");  // ← Era fetchArtists
            return;
        }

        const timer = setTimeout(() => {
            fetchSongs(buscar);  // ← Era fetchArtists
        }, 200);

        return () => clearTimeout(timer);
    }, [buscar]);

    // 3º fetchSongs (minúscula!)
    const fetchSongs = async (query) => {  // ← Era FetchSongs (mayúscula)
        const token = getAccessToken();
        if (!token) return;

        const res = await fetch(
            `https://api.spotify.com/v1/search?type=track&q=${query}&limit=15`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if(!data.tracks?.items) return;

        setTracks(data.tracks.items.map((t) => ({
            id: t.id,                                    // ← Faltaba id
            name: t.name,
            artist: t.artists[0]?.name,                  // ← Era t.artist
            image: t.album.images?.[0]?.url || "/default-image.jpg",  // ← Era t.images
        })));
    };

    // 4º toggleSelect
    const toggleSelect = (track) => {
        setSelected((prev) => {
            let newSelected;

            if (prev.find((a) => a.id === track.id)) {
                newSelected = prev.filter((a) => a.id !== track.id);
            } else {
                newSelected = [...prev, track];
            }
            localStorage.setItem('favorite_songs', JSON.stringify(newSelected));
            return newSelected;
        });
    };

    return (
        <div>
            {/* Buscador */}
            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Buscar canción..."
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                    className="flex-1 max-w-md px-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Canciones */}
            <div className="grid grid-cols-5 gap-4">
                {tracks.map((track) => (           // ← Era artists.map((artist))
                    <div
                        key={track.id}              // ← Era artist.id
                        onClick={() => toggleSelect(track)}  // ← Era artist
                        className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                            selected.find((s) => s.id === track.id)  // ← Era artist.id
                                ? "bg-green-600 ring-2 ring-green-400"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <img
                            src={track.image}       // ← Era artist.image
                            alt={track.name}        // ← Era artist.name
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                        />
                        <p className="text-white text-center text-sm truncate">{track.name}</p>
                        <p className="text-gray-400 text-center text-xs truncate">{track.artist}</p>
                    </div>
                ))}
            </div>

            {/* Favoritos seleccionados */}
            {selected.length > 0 && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                    <h3 className="text-white font-bold mb-3">⭐ Favoritos ({selected.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {selected.map((t) => (
                            <span key={t.id} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                {t.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}