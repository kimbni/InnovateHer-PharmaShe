"use client";

import { useState } from "react";
import Link from "next/link";
import DrugSearch from "./components/drugSearch";
import AnalysisResults from "./components/analysisResults";

import dynamic from "next/dynamic";



export default function Home() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (drugs: string[]) => {
    setIsLoading(true);
    setError(null);
    setSelectedDrugs(drugs);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drugs,
          context: "women's health analysis",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details ?? data.error ?? "Analysis failed");
      setAnalysis(data.analysis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze drugs";
      setError(errorMessage);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setAnalysis(null);
    setSelectedDrugs([]);
    setError(null);
  };

  return (
    <div className="min-h-screen gradient-header">
      {/* Header */}
      <header className="py-8 px-6 text-white shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">PharmaShe</h1>
            <p className="text-lg opacity-90">
              Women&apos;s Health Drug Interaction & Analysis Platform
            </p>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
          >
            My Profile
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search */}
          <div className="lg:col-span-1">
            <DrugSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="card">
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[rgb(205,160,177)] border-t-[rgb(163,75,103)] mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing drug interactions...</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="card bg-red-50 border-red-300">
                <div className="text-red-800">
                  <h3 className="font-bold mb-2">Error</h3>
                  <p>{error}</p>
                  <p className="mt-2 text-sm">
                    Please make sure you have configured your Gemini API key in .env.local
                  </p>
                </div>
              </div>
            )}

            {analysis && !isLoading && (
              <AnalysisResults
                analysis={analysis}
                drugs={selectedDrugs}
                onNewSearch={handleNewSearch}
              />
            )}

            {!analysis && !isLoading && !error && (
              <div className="card h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto mb-4 w-12 h-12 opacity-40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m0 0h6m0-11a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>Enter drugs above to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-bold text-[rgb(163,75,103)] mb-3">
              Why Women&apos;s Health Matters
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-[rgb(163,75,103)]">•</span>
                <span>Women&apos;s bodies process medications differently due to hormonal factors</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(163,75,103)]">•</span>
                <span>Pregnancy and breastfeeding create unique medication considerations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(163,75,103)]">•</span>
                <span>Hormonal contraceptives can interact with many medications</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(163,75,103)]">•</span>
                <span>Dosage adjustments may be needed for women vs. men</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-[rgb(86,109,150)] mb-3">
              How to Use PharmaShe
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-[rgb(86,109,150)]">1.</span>
                <span>Enter your medications in the search box</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(86,109,150)]">2.</span>
                <span>Add multiple drugs to check for interactions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(86,109,150)]">3.</span>
                <span>Click &quot;Analyze Interactions&quot; for a detailed report</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(86,109,150)]">4.</span>
                <span>Consult with your healthcare provider</span>
              </li>
            </ol>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[rgb(86,109,150)] text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p className="mb-3">
            PharmaShe is an educational tool providing drug interaction information. Always
            consult healthcare professionals before making medication decisions.
          </p>
          <p className="opacity-75">
            Data sourced from FDA Drugs Database and analyzed using advanced AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
