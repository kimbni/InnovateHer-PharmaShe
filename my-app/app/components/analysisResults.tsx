"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

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

  const mdComponents: Components = {
    h1: ({ children }) => (
      <h1 className="text-xl font-bold text-[rgb(163,75,103)] mt-6 mb-2 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-bold text-[rgb(163,75,103)] mt-5 mb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-bold text-[rgb(86,109,150)] mt-4 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-900 mb-3 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-none space-y-1.5 mb-3 pl-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1.5 mb-3 pl-2">
        {children}
      </ol>
    ),
    li: ({ children, node, ...rest }) => {
      const checked = (node as { checked?: boolean } | undefined)?.checked;
      return (
        <li className="flex items-start gap-2 text-gray-900 mb-1" {...rest}>
          {typeof checked === "boolean" ? (
            <span className="flex items-center justify-center w-5 h-5 mt-0.5 rounded border border-[rgb(205,160,177)] bg-white shrink-0">
              {checked ? (
                <span className="text-[rgb(163,75,103)] font-bold" aria-hidden>✓</span>
              ) : (
                <span className="w-3 h-3 rounded-sm border border-gray-300" aria-hidden />
              )}
            </span>
          ) : (
            <span className="text-[rgb(163,75,103)] mr-1.5">•</span>
          )}
          <span className="flex-1 text-gray-900">{children}</span>
        </li>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
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

      <div className="bg-gray-50 p-5 rounded-lg border border-[rgb(205,160,177)]">
        <div className="analysis-output text-gray-900">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {analysis}
          </ReactMarkdown>
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
