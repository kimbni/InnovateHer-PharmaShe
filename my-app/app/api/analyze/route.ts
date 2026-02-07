import { NextRequest, NextResponse } from "next/server";
import { analyzeDrugInteractions } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { drugs, context } = await request.json();

    if (!drugs || !Array.isArray(drugs) || drugs.length === 0) {
      return NextResponse.json(
        { error: "Drugs array is required and must not be empty" },
        { status: 400 }
      );
    }

    const analysis = await analyzeDrugInteractions(drugs, context || "women's health analysis");

    return NextResponse.json({
      success: true,
      drugs,
      analysis,
    });
  } catch (error) {
    console.error("API Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to analyze drugs",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// TEST DEFAULTS
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Drug Analysis API",
    usage: "POST /api/analyze with body: { drugs: string[], context?: string }",
    example: {
      method: "POST",
      body: {
        drugs: ["Ibuprofen", "Aspirin"],
        context: "women's health analysis",
      },
    },
  });
}
