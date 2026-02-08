"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import DictionaryTooltip from "./dictionaryTooltip";

interface AnalysisResultsProps {
  analysis: string;
  drugs: string[];
  onNewSearch?: () => void;
}

// Common words that users likely know - exclude from being clickable
const EXCLUDE_WORDS = new Set([
  // Common words (regardless of length)
  "the", "and", "for", "with", "that", "this", "from", "have", "were",
  "been", "has", "had", "are", "was", "will", "can", "may", "should",
  "could", "would", "your", "you", "they", "their", "there", "these",
  "those", "more", "most", "some", "such", "what", "when", "where",
  "which", "who", "how", "why", "about", "before", "after", "during",
  "between", "through", "into", "out", "over", "under", "again",
  "also", "only", "just", "very", "too", "any", "all", "each", "every",
  "other", "another", "much", "many", "few", "several", "both", "either",
  "neither", "however", "therefore", "because", "since", "unless", "until",

  // Common medical/health words users likely know
  "pregnancy", "pregnant", "breastfeeding", "menstrual", "pain",
  "effective", "treatment", "medication", "medicine", "condition",
  "symptoms", "recommended", "common", "general", "specific",
  "increase", "decrease", "reduce", "improve", "prevent",
  "treatment", "dose", "dosage", "doctor", "provider",
  "patient", "health", "healthy", "medical", "clinical",
  "studies", "research", "study", "report", "suggest",
  "suggested", "important", "serious", "severe", "mild",
  "moderate", "chronic", "acute", "potential", "possible",
  "likely", "unlikely", "risk", "risks", "benefit", "benefits",
  "side", "effects", "reaction", "reactions", "adverse",

  // Long common words
  "however", "therefore", "otherwise", "moreover", "furthermore",
  "although", "according", "including", "following", "regarding",
  "concerning", "considering", "especially", "particularly",
  "generally", "specifically", "significantly", "importantly",
  "information", "understand", "understanding", "different",
  "individual", "individuals", "certain", "various", "several",
  "available", "necessary", "essential", "appropriate",
  "effective", "carefully", "properly", "regularly",
  "observational", "developmental", "prolonged", "preferred",
  "considered", "compatible", "targeting", "inflammatory",
  "properties", "contraceptives", "hormonal",
]);

// Medical/pharmaceutical terms that should be clickable
const MEDICAL_TERMS = new Set([
  // Drug names and classes
  "acetaminophen", "ibuprofen", "warfarin", "coumadin", "phenytoin",
  "carbamazepine", "isoniazid", "nsaid", "nsaids", "anticonvulsants",
  "anticoagulant", "anticoagulants", "antidepressant", "antidepressants",

  // Technical medical terms
  "hepatotoxicity", "hepatotoxic", "hepatic", "teratogenic",
  "pharmacokinetics", "bioavailability", "metabolism", "metabolize",
  "cytochrome", "prostaglandins", "prostaglandin",

  // Medical conditions/processes (technical)
  "hypertension", "hypotension", "tachycardia", "arrhythmia",
  "neutropenia", "thrombocytopenia", "leukopenia",
  "nephrotoxicity", "nephrotoxic", "cardiotoxicity",
  "ototoxicity", "neurotoxicity",

  // Body systems (technical terms only)
  "gastrointestinal", "cardiovascular", "renal", "hepatic",
  "hematologic", "neurological", "endocrine",

  // Medical suffixes
  "syndrome", "disease", "disorder", "deficiency",
]);

// Function to determine if a word should be clickable
const isComplexWord = (word: string): boolean => {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');

  // Skip if too short
  if (cleaned.length < 7) return false;

  // Skip if in exclude list (common words users know)
  if (EXCLUDE_WORDS.has(cleaned)) return false;

  // Include if explicitly in medical terms list
  if (MEDICAL_TERMS.has(cleaned)) return true;

  // Check for technical medical word patterns
  const medicalPatterns = [
    /itis$/,       // inflammation (hepatitis, arthritis)
    /osis$/,       // condition (fibrosis, necrosis, thrombosis)
    /emia$/,       // blood condition (anemia, leukemia, septicemia)
    /pathy$/,      // disease (neuropathy, myopathy, nephropathy)
    /genic$/,      // causing (teratogenic, carcinogenic, allergenic)
    /^hepato/,     // liver-related (hepatotoxicity, hepatocyte)
    /^nephro/,     // kidney-related (nephrotoxicity, nephropathy)
    /^cardio/,     // heart-related (cardiotoxicity, cardiomyopathy)
    /^neuro/,      // nerve-related (neurotoxicity, neuropathy)
    /toxic/,       // toxicity-related (hepatotoxic, neurotoxic)
    /penia$/,      // deficiency (neutropenia, thrombocytopenia)
    /uria$/,       // urine condition (hematuria, proteinuria)
    /oma$/,        // tumor (carcinoma, lymphoma)
    /plasty$/,     // surgical repair (angioplasty)
    /ectomy$/,     // surgical removal (appendectomy)
    /scopy$/,      // examination (colonoscopy, endoscopy)
    /phagia$/,     // eating/swallowing (dysphagia)
    /kinetics$/,   // pharmacokinetics
    /^cyto/,       // cell-related (cytochrome, cytotoxic)
  ];

  // Only clickable if matches medical pattern AND is 8+ chars
  if (cleaned.length >= 8) {
    return medicalPatterns.some(pattern => pattern.test(cleaned));
  }

  return false;
};

export default function AnalysisResults({
  analysis,
  drugs,
  onNewSearch,
}: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    position: { x: number; y: number };
  } | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedWord({
      word: word.toLowerCase(),
      position: { x: event.clientX, y: event.clientY + 10 },
    });
  };

  const makeTermsClickable = (text: string) => {
    // Split text into words while preserving punctuation and spaces
    const regex = /\b[a-zA-Z]+\b/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    const clickableWords = new Set<string>();

    while ((match = regex.exec(text)) !== null) {
      const word = match[0];

      // Check if this word should be clickable
      if (isComplexWord(word)) {
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }

        // Add clickable term (avoid duplicates in same text block)
        const lowerWord = word.toLowerCase();
        const key = `${match.index}-${word}`;

        parts.push(
          <button
            key={key}
            onClick={(e) => handleWordClick(lowerWord, e)}
            className="text-[rgb(163,75,103)] underline decoration-dotted hover:decoration-solid hover:bg-[rgb(255,250,252)] cursor-help rounded px-0.5 transition-colors"
            title="Click for definition"
          >
            {word}
          </button>
        );

        lastIndex = match.index + word.length;
        clickableWords.add(lowerWord);
      }
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const processTextContent = (children: any): any => {
    if (typeof children === "string") {
      return makeTermsClickable(children);
    }

    if (Array.isArray(children)) {
      return children.map((child, idx) =>
        typeof child === "string" ? (
          <span key={idx}>{makeTermsClickable(child)}</span>
        ) : (
          child
        )
      );
    }

    return children;
  };

  const mdComponents: Components = {
    h1: ({ children }) => (
      <h1 className="text-xl font-bold text-[rgb(163,75,103)] mt-6 mb-2 first:mt-0">
        {processTextContent(children)}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-bold text-[rgb(163,75,103)] mt-5 mb-2">
        {processTextContent(children)}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-bold text-[rgb(86,109,150)] mt-4 mb-2">
        {processTextContent(children)}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-900 mb-3 leading-relaxed">
        {processTextContent(children)}
      </p>
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
          <span className="flex-1 text-gray-900">
            {processTextContent(children)}
          </span>
        </li>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">
        {processTextContent(children)}
      </strong>
    ),
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[rgb(163,75,103)] mb-2">
              Analysis Results
            </h2>
            <p className="text-sm text-gray-600">
              Analyzing: {drugs.join(", ")}
            </p>
            <p className="text-xs text-[rgb(163,75,103)] mt-1 flex items-center gap-1">
              <span className="text-base">💡</span>
              <span>Click on underlined technical terms for definitions</span>
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

      {selectedWord && (
        <DictionaryTooltip
          word={selectedWord.word}
          position={selectedWord.position}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </>
  );
}