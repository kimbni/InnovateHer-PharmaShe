import { GoogleGenAI } from "@google/genai";

// Use server-only env var (not NEXT_PUBLIC_) so the key is never exposed to the client
function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY is not set. Please add GEMINI_API_KEY=your_key to .env.local and restart the dev server."
    );
  }
  return apiKey.trim();
}

// Lazy-initialize so the key is read on the server when first used, not at import time.
let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!ai) ai = new GoogleGenAI({ apiKey: getApiKey() });
  return ai;
}

const DEFAULT_MODEL = "gemini-3-flash-preview";

/** Profile data sent from client (from localStorage) for personalized analysis */
export interface AnalysisProfile {
  heightCm?: string;
  weightKg?: string;
  underlyingConditions?: string;
  concerns?: string;
}

function formatProfileForPrompt(profile: AnalysisProfile): string {
  const parts: string[] = [];
  if (profile.heightCm?.trim()) parts.push(`Height: ${profile.heightCm} cm`);
  if (profile.weightKg?.trim()) parts.push(`Weight: ${profile.weightKg} kg`);
  if (profile.underlyingConditions?.trim()) parts.push(`Underlying conditions: ${profile.underlyingConditions}`);
  if (profile.concerns?.trim()) parts.push(`Health concerns or notes: ${profile.concerns}`);
  return parts.join("\n");
}

export async function analyzeDrugInteractions(
  drugNames: string[],
  userContext: string = "women's health",
  profile?: AnalysisProfile | null
): Promise<string> {
  const hasProfile =
    profile &&
    (profile.underlyingConditions?.trim() ||
      profile.concerns?.trim() ||
      profile.heightCm?.trim() ||
      profile.weightKg?.trim());

  const profileSection = hasProfile
    ? `

USER PROFILE (personalize the analysis using this):
${formatProfileForPrompt(profile!)}

When the user has provided profile data above:
- Bold any potential side effects or interactions that are especially relevant to this user (use **bold** markdown).
- For each such item, add a short explanation starting with "Why this matters for you:" so the user understands the relevance to their profile.
- Do not use emojis anywhere in your response.
- You may use checkboxes in lists: use "- [ ]" for an unchecked item and "- [x]" for a checked/completed item.`
    : `

Formatting rules: Do not use emojis. You may use checkboxes in lists: "- [ ]" for unchecked and "- [x]" for checked. Use **bold** for drug names and important terms.`;

  const prompt = `You are a pharmaceutical expert specializing in women's health.

Analyze the following drugs for potential interactions and their specific effects on women's health:
Drugs: ${drugNames.join(", ")}

Please provide:
1. Any potential drug-drug interactions
2. Specific concerns or benefits for women
3. Dosage considerations for women
4. Potential side effects that may be more pronounced in women
5. Recommendations for monitoring or usage

Context: ${userContext}
${profileSection}

Be detailed but concise, and always recommend consulting with a healthcare provider.`;

  try {
    const response = await getClient().models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });
    return response.text ?? "";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error calling Gemini API:", error);
    throw new Error(
      `Failed to analyze drugs with Gemini API. ${message} Please make sure GEMINI_API_KEY is set in .env.local and the key is valid.`
    );
  }
}

export async function getDrugSideEffects(drugName: string): Promise<string> {
  const prompt = `Provide a comprehensive overview of side effects for ${drugName}, specifically noting any that may be more common or severe in women. Include:
1. Common side effects
2. Serious side effects
3. Women-specific considerations
4. Pregnancy/breastfeeding implications
Keep the response concise and factual.`;

  try {
    const response = await getClient().models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });
    return response.text ?? "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to retrieve side effects");
  }
}

export async function getWomenHealthGuidance(drugName: string): Promise<string> {
  const prompt = `Provide women's health specific guidance for ${drugName}. Include:
1. How this drug affects women differently than men (if applicable)
2. Hormonal interaction considerations
3. Pregnancy/breastfeeding safety
4. Drug interactions with common women's health medications (birth control, hormone therapy, etc.)
5. Any special monitoring needed for women

Be thorough and evidence-based.`;

  try {
    const response = await getClient().models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });
    return response.text ?? "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to retrieve women's health guidance");
  }
}
