import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GEMINI_API_KEY is not set. Please add it to your .env.local file."
    );
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function analyzeDrugInteractions(
  drugNames: string[],
  userContext: string = "women's health"
): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-pro" });

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

Be detailed but concise, and always recommend consulting with a healthcare provider.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze drugs with Gemini API");
  }
}

export async function getDrugSideEffects(
  drugName: string
): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Provide a comprehensive overview of side effects for ${drugName}, specifically noting any that may be more common or severe in women. Include:
1. Common side effects
2. Serious side effects
3. Women-specific considerations
4. Pregnancy/breastfeeding implications
Keep the response concise and factual.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to retrieve side effects");
  }
}

export async function getWomenHealthGuidance(
  drugName: string
): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Provide women's health specific guidance for ${drugName}. Include:
1. How this drug affects women differently than men (if applicable)
2. Hormonal interaction considerations
3. Pregnancy/breastfeeding safety
4. Drug interactions with common women's health medications (birth control, hormone therapy, etc.)
5. Any special monitoring needed for women

Be thorough and evidence-based.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to retrieve women's health guidance");
  }
}
