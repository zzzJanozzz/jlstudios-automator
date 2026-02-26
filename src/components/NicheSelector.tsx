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
    const cfg = NICHE_CONFIGS[n];
    const q = search.toLowerCase();
    return cfg.label.toLowerCase().includes(q) || cfg.id.toLowerCase().includes(q);
  });

  return (
    <div className="glass-panel p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#fafafa" }}>
            1. Seleccioná el rubro del cliente
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#71717a" }}>
            Calibra la IA para extraer datos con mayor precisión.
          </p>
        </div>
        {niche && (
          <span
            className="text-xs px-2.5 py-1 rounded-md flex-shrink-0"
            style={{
              backgroundColor: "rgb(109 40 217 / 0.12)",
              border: "1px solid rgb(109 40 217 / 0.25)",
              color: "#a78bfa",
            }}
          >
            {NICHE_CONFIGS[niche].icon} {NICHE_CONFIGS[niche].label}
          </span>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar rubro..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4"
      />

      {/* Grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 pr-1"
        style={{ maxHeight: "280px", overflowY: "auto" }}
      >
        {filtered.map((nicheId, index) => {
          const cfg = NICHE_CONFIGS[nicheId];
          const isSelected = niche === nicheId;

          return (
            <motion.button
              key={nicheId}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.015, duration: 0.2 }}
              onClick={() => setNiche(nicheId)}
              className="group relative flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: isSelected ? "rgb(109 40 217 / 0.12)" : "rgb(24 24 27 / 0.5)",
                borderColor: isSelected ? "rgb(109 40 217 / 0.5)" : "#27272a",
                boxShadow: isSelected ? "0 0 0 1px rgb(109 40 217 / 0.2)" : "none",
              }}
            >
              <span className="text-2xl leading-none">{cfg.icon}</span>
              <span
                className="text-[11px] font-medium leading-tight"
                style={{ color: isSelected ? "#c4b5fd" : "#a1a1aa" }}
              >
                {cfg.label}
              </span>

              {/* Selection indicator dot — FIX: use explicit hex, NOT border-studio-bg */}
              {isSelected && (
                <motion.div
                  layoutId="niche-indicator"
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: "#7c3aed",
                    border: "2px solid #09090b", /* explicit hex — fixes invisible ring bug */
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm py-8" style={{ color: "#52525b" }}>
          No se encontraron rubros para &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}
