"use client";

import { useState, useCallback } from "react";

export interface DrugInfoFromFDA {
  name: string;
  activeIngredients: string[];
  dosageForm?: string;
  route?: string;
  manufacturer?: string;
}

interface DrugSearchProps {
  onSearch: (drugs: string[]) => void;
  isLoading?: boolean;
}

export default function DrugSearch({ onSearch, isLoading = false }: DrugSearchProps) {
  const [input, setInput] = useState("");
  const [drugs, setDrugs] = useState<string[]>([]);
  const [drugDetails, setDrugDetails] = useState<Record<string, DrugInfoFromFDA>>({});
  const [fetchingDrug, setFetchingDrug] = useState<string | null>(null);

  const fetchFDAData = useCallback(async (drugName: string): Promise<DrugInfoFromFDA | null> => {
    try {
      const res = await fetch(
        `/api/drugs?q=${encodeURIComponent(drugName)}&type=brand`
      );
      const data = await res.json();
      if (!data.success || !Array.isArray(data.results) || data.results.length === 0) {
        return { name: drugName, activeIngredients: [] };
      }
      const first = data.results[0];
      return {
        name: first.name ?? drugName,
        activeIngredients: first.activeIngredients ?? [],
        dosageForm: first.dosageForm,
        route: first.route,
        manufacturer: first.manufacturer,
      };
    } catch {
      return { name: drugName, activeIngredients: [] };
    }
  }, []);

  const handleAddDrug = async () => {
    const trimmed = input.trim();
    if (!trimmed || drugs.includes(trimmed)) {
      setInput("");
      return;
    }
    const newDrugs = [...drugs, trimmed];
    setDrugs(newDrugs);
    setInput("");
    setFetchingDrug(trimmed);
    const info = await fetchFDAData(trimmed);
    setDrugDetails((prev) => ({ ...prev, [trimmed]: info ?? { name: trimmed, activeIngredients: [] } }));
    setFetchingDrug(null);
  };

  const handleRemoveDrug = (drugToRemove: string) => {
    setDrugs((prev) => prev.filter((d) => d !== drugToRemove));
    setDrugDetails((prev) => {
      const next = { ...prev };
      delete next[drugToRemove];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drugs.length > 0) {
      onSearch(drugs);
    }
  };

  return (
    <div className="card min-h-96">
      <h2 className="text-2xl font-bold mb-4 text-[rgb(163,75,103)]">Drug Analysis</h2>
      <p className="text-gray-600 mb-6">
        Enter one or more medications to analyze interactions and women&apos;s health considerations.
        Active ingredients from the FDA database are shown below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddDrug();
              }
            }}
            placeholder="Enter drug name (e.g., Ibuprofen, Metformin)"
            className="flex-1 px-4 py-2 border border-[rgb(205,160,177)] rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-[rgb(163,75,103)]
                                 text-gray-800 dark:text-gray-100
                                 placeholder:text-gray-400 dark:placeholder:text-gray-500"

            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleAddDrug}
            disabled={isLoading || !input.trim() || fetchingDrug !== null}
            className="px-6 py-2 bg-[rgb(205,160,177)] text-gray-700 rounded-lg hover:bg-[rgb(185,140,157)] transition-colors disabled:opacity-50"
          >
            Query
          </button>
        </div>

        {drugs.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Selected Drugs & Active Ingredients</h3>
            <div className="flex flex-col gap-3">
              {drugs.map((drug) => {
                const details = drugDetails[drug];
                const loading = fetchingDrug === drug;
                return (
                  <div
                    key={drug}
                    className="rounded-lg border border-[rgb(205,160,177)] bg-[rgb(255,250,252)] p-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium text-[rgb(163,75,103)]">
                        {details?.name ?? drug}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDrug(drug)}
                        className="hover:bg-[rgb(205,160,177)] text-gray-600 hover:text-white rounded-full p-1 transition-colors"
                        aria-label={`Remove ${drug}`}
                      >
                        ×
                      </button>
                    </div>
                    {loading && (
                      <p className="text-sm text-gray-500 mt-1">Loading FDA data…</p>
                    )}
                    {!loading && details?.activeIngredients && details.activeIngredients.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          Active ingredients
                        </p>
                        <ul className="text-sm text-black list-disc list-inside space-y-0.5">
                          {details.activeIngredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!loading && details && (!details.activeIngredients || details.activeIngredients.length === 0) && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        No active ingredients found in FDA database for this name.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={drugs.length === 0 || isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Analyzing..." : "Analyze Interactions"}
        </button>
      </form>
    </div>
  );
}
