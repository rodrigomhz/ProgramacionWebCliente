'use client';

import { useState, useEffect } from "react";
import ArtistWidget from "@/components/widgets/ArtistWidget";

export default function Dashboard() {
  // === ESTADOS ===
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // === BUSCAR ARTISTAS EN SPOTIFY ===
  const searchArtists = async (query) => {
    if (!query) return;

    // ❗ Aquí luego pondremos tu token real OAuth
    const token = "TU_TOKEN_TEMPORAL";

    const url = `https://api.spotify.com/v1/search?type=artist&q=${query}&limit=5`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    const artists = data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || "/default-image.jpg",
    }));

    setArtistList(artists);
  };

  // === SELECCIONAR / DESELECCIONAR ARTISTA ===
  const handleArtistSelect = (artist) => {
    setSelectedArtists((prev) => {
      const exists = prev.find((p) => p.id === artist.id);

      if (exists) {
        return prev.filter((p) => p.id !== artist.id);
      }

      return [...prev, artist];
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar artista..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button onClick={() => searchArtists(searchQuery)}>
        Buscar
      </button>

      {/* Widget de artistas */}
      <ArtistWidget
        artists={artistList}
        selectedItems={selectedArtists}
        onSelect={handleArtistSelect}
      />

      <h2>Seleccionados</h2>
      <pre>{JSON.stringify(selectedArtists, null, 2)}</pre>
    </div>
  );
}
