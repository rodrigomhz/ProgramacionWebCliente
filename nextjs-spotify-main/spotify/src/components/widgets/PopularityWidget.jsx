'use client';

import { useState, useEffect } from "react";

export default function PopularityWidget() {
  // Estado para la popularidad seleccionada
  const [popularity, setPopularity] = useState(50);

  // Cargar popularidad guardada al montar
  useEffect(() => {
    const pop = localStorage.getItem('popularity');
    if (pop) setPopularity(Number(pop));
  }, []);

  // Cambia el valor del slider y lo guarda en localStorage
  const handleSlider = (e) => {
    const value = Number(e.target.value);
    setPopularity(value);
    localStorage.setItem('popularity', value);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/IMG/estrella.jpg')" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-950/80 via-purple-900/80 to-blue-950/80 p-8 -m-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-cyan-300 mb-8">Selecciona Popularidad</h1>
        <div className="w-full max-w-md flex flex-col items-center">
          <input
            type="range"
            min={0}
            max={100}
            value={popularity}
            onChange={handleSlider}
            className="w-full accent-cyan-400"
          />
          <span className="text-cyan-300 font-mono mt-4 text-2xl">
            {popularity}
          </span>
        </div>
      </div>
    </div>
  );
}