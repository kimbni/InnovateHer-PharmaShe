/**
 * Drugs@FDA openFDA API
 * @see https://open.fda.gov/apis/drug/drugsfda/how-to-use-the-endpoint/
 */

export interface ActiveIngredient {
  name: string;
  strength: string;
}

export interface DrugInfo {
  name: string;
  activeIngredients: string[];
  approvalDate?: string;
  dosageForm?: string;
  route?: string;
  manufacturer?: string;
  marketingStatus?: string;
}

interface FDAResultProduct {
  brand_name?: string;
  active_ingredients?: Array<{ name: string; strength: string }>;
  dosage_form?: string;
  route?: string;
  marketing_status?: string;
}

interface FDAResult {
  application_number?: string;
  sponsor_name?: string;
  products?: FDAResultProduct[];
}

const BASE_URL = "https://api.fda.gov/drug/drugsfda.json";
const MAX_LIMIT = 99;

function formatActiveIngredient(ing: { name: string; strength: string }): string {
  const s = ing.strength?.trim();
  return s ? `${ing.name} (${s})` : ing.name;
}

/**
 * Search Drugs@FDA by brand name or active ingredient name.
 * Returns one entry per product with active ingredients.
 */
export async function searchDrugAtFDA(drugName: string): Promise<DrugInfo[]> {
  if (!drugName?.trim()) return [];

  const term = drugName.trim();
  const encoded = encodeURIComponent(term);

  try {
    // Search by product brand name; openFDA is case-insensitive
    const url = `${BASE_URL}?search=products.brand_name:${encoded}&limit=${MAX_LIMIT}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`FDA API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as { results?: FDAResult[] };
    const results: FDAResult[] = data.results ?? [];

    const drugInfos: DrugInfo[] = [];

    for (const app of results) {
      const products = app.products ?? [];
      for (const p of products) {
        const name = p.brand_name ?? "Unknown";
        const activeIngredients: string[] = (p.active_ingredients ?? []).map(formatActiveIngredient);
        drugInfos.push({
          name,
          activeIngredients,
          dosageForm: p.dosage_form,
          route: p.route,
          manufacturer: app.sponsor_name,
          marketingStatus: p.marketing_status,
        });
      }
    }

    return drugInfos;
  } catch (error) {
    console.error("Error searching FDA database:", error);
    return [];
  }
}

/**
 * Search by active ingredient name (e.g. "IBUPROFEN") to find drugs containing it.
 */
export async function searchByActiveIngredient(ingredientName: string): Promise<DrugInfo[]> {
  if (!ingredientName?.trim()) return [];

  const term = ingredientName.trim();
  const encoded = encodeURIComponent(term);

  try {
    const url = `${BASE_URL}?search=products.active_ingredients.name:${encoded}&limit=${MAX_LIMIT}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`FDA API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as { results?: FDAResult[] };
    const results: FDAResult[] = data.results ?? [];
    const drugInfos: DrugInfo[] = [];

    for (const app of results) {
      const products = app.products ?? [];
      for (const p of products) {
        const name = p.brand_name ?? "Unknown";
        const activeIngredients: string[] = (p.active_ingredients ?? []).map(formatActiveIngredient);
        drugInfos.push({
          name,
          activeIngredients,
          dosageForm: p.dosage_form,
          route: p.route,
          manufacturer: app.sponsor_name,
          marketingStatus: p.marketing_status,
        });
      }
    }

    return drugInfos;
  } catch (error) {
    console.error("Error searching FDA by ingredient:", error);
    return [];
  }
}

/**
 * Get active ingredients for a drug (first matching product).
 */
export async function getActiveIngredients(drugName: string): Promise<string[]> {
  const drugs = await searchDrugAtFDA(drugName);
  if (drugs.length > 0 && drugs[0].activeIngredients.length > 0) {
    return drugs[0].activeIngredients;
  }
  return [];
}
