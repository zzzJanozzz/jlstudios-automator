// src/components/ColorPicker.tsx

"use client";

import { useState, useRef, useEffect } from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (v: string) => {
    setInputValue(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      onChange(v);
    }
  };

  return (
    <div ref={ref} className="relative">
      <label className="label-text mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-lg border border-zinc-700 flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="input-field font-mono text-xs py-1.5"
          maxLength={7}
          placeholder="#000000"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 glass-panel p-3 shadow-2xl">
          <input
            type="color"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setInputValue(e.target.value);
            }}
            className="w-48 h-40 cursor-pointer bg-transparent border-none rounded-lg"
          />
        </div>
      )}
    </div>
  );
}