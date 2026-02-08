"use client";

import { useState, useEffect, useRef } from "react";

interface DictionaryTooltipProps {
  word: string;
  onClose: () => void;
  position: { x: number; y: number };
}

interface Definition {
  partOfSpeech: string;
  definition: string;
}

export default function DictionaryTooltip({
  word,
  onClose,
  position,
}: DictionaryTooltipProps) {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using Free Dictionary API
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );

        if (!response.ok) {
          throw new Error("Definition not found");
        }

        const data = await response.json();

        // Extract definitions from the API response
        const defs: Definition[] = [];
        data[0]?.meanings?.forEach((meaning: any) => {
          meaning.definitions?.slice(0, 2).forEach((def: any) => {
            defs.push({
              partOfSpeech: meaning.partOfSpeech,
              definition: def.definition,
            });
          });
        });

        setDefinitions(defs.slice(0, 3)); // Limit to 3 definitions
      } catch (err) {
        setError("Definition not available");
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Position tooltip to avoid going off-screen
  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    left: `${Math.min(position.x, window.innerWidth - 320)}px`,
    top: `${Math.min(position.y, window.innerHeight - 200)}px`,
    zIndex: 1000,
  };

  return (
    <div
      ref={tooltipRef}
      style={tooltipStyle}
      className="w-80 bg-white rounded-lg shadow-2xl border-2 border-[rgb(163,75,103)] p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-[rgb(163,75,103)] capitalize" style={{ fontFamily: "var(--font-league-spartan)" }}>
          {word}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[rgb(205,160,177)] border-t-[rgb(163,75,103)] mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Loading definition...</p>
        </div>
      )}

      {error && (
        <div className="text-sm text-gray-600 py-2">
          <p>{error}</p>
          <p className="mt-2 text-xs">
            Try searching online for medical terminology definitions.
          </p>
        </div>
      )}

      {!loading && !error && definitions.length > 0 && (
        <div className="space-y-3">
          {definitions.map((def, idx) => (
            <div key={idx} className="border-l-2 border-[rgb(205,160,177)] pl-3">
              <p className="text-xs font-semibold text-[rgb(86,109,150)] uppercase mb-1">
                {def.partOfSpeech}
              </p>
              <p className="text-sm text-gray-800">{def.definition}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Click outside to close • Definitions from Free Dictionary API
        </p>
      </div>
    </div>
  );
}