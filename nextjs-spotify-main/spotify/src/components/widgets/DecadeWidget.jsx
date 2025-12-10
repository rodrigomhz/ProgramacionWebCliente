'use client';

import { useState, useEffect } from "react";

// Lista de décadas disponibles (solo los años acabados en 0)
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

export default function DecadeWidget() {
  // Estado para décadas seleccionadas
  const [selected, setSelected] = useState([]);

  // Al montar, cargar décadas guardadas en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorite_decades');
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  // Añadir o quitar década de favoritos
  const toggleSelect = (decade) => {
    setSelected(prev => {
      let updated;
      if (prev.includes(decade.value)) {
        updated = prev.filter(d => d !== decade.value);
      } else {
        updated = [...prev, decade.value];
      }
      localStorage.setItem('favorite_decades', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/IMG/estrella.jpg')" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-950/80 via-purple-900/80 to-blue-950/80 p-8 -m-8">
        <h1 className="text-4xl font-bold text-cyan-300 mb-8">Décadas musicales</h1>

        {/* Lista de décadas */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {DECADES.map(decade => (
            <div
              key={decade.value}
              onClick={() => toggleSelect(decade)}
              className={`text-center group cursor-pointer transition-all hover:scale-105 ${
                selected.includes(decade.value)
                  ? "bg-cyan-400/80 ring-4 ring-yellow-300 shadow-xl shadow-cyan-500/50"
                  : "bg-purple-900/40 backdrop-blur-sm hover:bg-purple-800/50 border-2 border-cyan-400/30"
              } p-4 rounded-3xl`}
            >
              <p className="text-white text-lg font-semibold">{decade.label}</p>
              <span className="block mt-2 text-xs text-cyan-300">
                {selected.includes(decade.value) ? 'Seleccionada' : 'Click para seleccionar'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}