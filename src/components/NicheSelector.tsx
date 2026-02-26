// src/components/NicheSelector.tsx

"use client";

import { useAppStore } from "@/lib/store";
import { NICHE_CONFIGS, Niche, SUPPORTED_NICHES } from "@/lib/types";
import { motion } from "framer-motion";
import { useState } from "react";

export function NicheSelector() {
  const { niche, setNiche } = useAppStore();
  const [search, setSearch] = useState("");

  const filtered = SUPPORTED_NICHES.filter((n) => {
    const config = NICHE_CONFIGS[n];
    const q = search.toLowerCase();
    return (
      config.label.toLowerCase().includes(q) ||
      config.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            1. Seleccioná el rubro del cliente
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Esto calibra la IA para extraer datos con mayor precisión.
          </p>
        </div>
        {niche && (
          <span className="text-xs text-violet-400 bg-violet-500/10 px-2 py-1 rounded-md">
            {NICHE_CONFIGS[niche].icon} {NICHE_CONFIGS[niche].label}
          </span>
        )}
      </div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar rubro..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4"
      />

      {/* Grid de nichos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
        {filtered.map((nicheId, index) => {
          const config = NICHE_CONFIGS[nicheId];
          const isSelected = niche === nicheId;

          return (
            <motion.button
              key={nicheId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              onClick={() => setNiche(nicheId)}
              className={`
                group relative flex flex-col items-center gap-1.5 p-3 rounded-lg
                border text-center transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "bg-violet-500/15 border-violet-500/50 ring-1 ring-violet-500/30"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50"
                }
              `}
            >
              <span className="text-2xl leading-none">{config.icon}</span>
              <span
                className={`text-[11px] font-medium leading-tight ${
                  isSelected ? "text-violet-300" : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              >
                {config.label}
              </span>

              {isSelected && (
                <motion.div
                  layoutId="niche-indicator"
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-500 border-2 border-studio-bg"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-500 text-sm py-8">
          No se encontraron rubros para &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}