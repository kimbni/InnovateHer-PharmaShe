import { NextRequest, NextResponse } from "next/server";
import { searchDrugAtFDA, searchByActiveIngredient } from "@/lib/drugsAtFDA";

/**
 * GET /api/drugs?q=IBUPROFEN&type=brand
 * Query openFDA Drugs@FDA. type=brand (default) searches by product name; type=ingredient searches by active ingredient.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? searchParams.get("search") ?? "";
  const type = (searchParams.get("type") ?? "brand").toLowerCase();

  if (!q.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'q' or 'search' is required" },
      { status: 400 }
    );
  }

  try {
    const results =
      type === "ingredient"
        ? await searchByActiveIngredient(q)
        : await searchDrugAtFDA(q);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Drugs API error:", error);
    return NextResponse.json(
      { error: "Failed to search FDA drug database" },
      { status: 500 }
    );
  }
}
