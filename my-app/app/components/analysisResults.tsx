"use client";

import { useState } from "react";

interface AnalysisResultsProps {
  analysis: string;
  drugs: string[];
  onNewSearch?: () => void;
}

export default function AnalysisResults({
  analysis,
  drugs,
  onNewSearch,
}: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[rgb(163,75,103)] mb-2">
            Analysis Results
          </h2>
          <p className="text-sm text-gray-600">
            Analyzing: {drugs.join(", ")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="btn-secondary"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          {onNewSearch && (
            <button
              onClick={onNewSearch}
              className="btn-primary"
            >
              New Search
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-[rgb(205,160,177)]">
        <div className="prose prose-sm max-w-none">
          {analysis.split("\n").map((line, idx) => {
            if (line.trim() === "") return <div key={idx} className="h-3" />;
            if (line.startsWith("##")) {
              return (
                <h3 key={idx} className="text-lg font-bold text-[rgb(86,109,150)] mt-4 mb-2">
                  {line.replace(/^##\s*/, "")}
                </h3>
              );
            }
            if (line.startsWith("#")) {
              return (
                <h2 key={idx} className="text-xl font-bold text-[rgb(163,75,103)] mt-4 mb-2">
                  {line.replace(/^#\s*/, "")}
                </h2>
              );
            }
            return (
              <p key={idx} className="text-gray-700 mb-2">
                {line}
              </p>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-[rgb(86,109,150)] rounded-lg">
        <p className="text-sm text-gray-700">
          <strong className="text-[rgb(86,109,150)]">Disclaimer:</strong>
          This analysis is for informational purposes only. Always consult with a healthcare
          provider before making decisions about medications, especially regarding interactions
          and women-specific health concerns.
        </p>
      </div>
    </div>
  );
}
