"use client";

interface WomenHealthConsiderationsProps {
  drugs: string[];
}

export default function WomenHealthConsiderations({
  drugs, // DO THE API call here
}: WomenHealthConsiderationsProps) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-[rgb(163,75,103)] mb-4" style={{ fontFamily: "var(--font-league-spartan)" }}>
        Women&apos;s Health Considerations
      </h3>

      <div className="space-y-4">
        <div className="border-l-4 border-[rgb(163,75,103)] pl-4">
          <h4 className="font-semibold text-black mb-2" style={{ fontFamily: "var(--font-league-spartan)" }}>Hormonal Interactions</h4>
          <p className="text-sm text-gray-700">
            Many drugs can interact with hormonal contraceptives, hormone replacement therapy,
            or menstrual cycles. This analysis includes specific checks for these interactions.
          </p>
        </div>

        <div className="border-l-4 border-[rgb(205,160,177)] pl-4">
          <h4 className="font-semibold text-black mb-2" style={{ fontFamily: "var(--font-league-spartan)" }}>Pregnancy & Breastfeeding</h4>
          <p className="text-sm text-gray-700">
            Certain drugs are contraindicated during pregnancy or breastfeeding. Always consult
            with your OB/GYN if you are pregnant, planning to become pregnant, or breastfeeding.
          </p>
        </div>

        <div className="border-l-4 border-[rgb(86,109,150)] pl-4">
          <h4 className="font-semibold text-black mb-2" style={{ fontFamily: "var(--font-league-spartan)" }}>Sex-Based Differences</h4>
          <p className="text-sm text-gray-700">
            Women often require different dosages than men due to differences in body composition,
            metabolism, and hormonal factors. Our analysis highlights these differences.
          </p>
        </div>

        <div className="border-l-4 border-[rgb(163,75,103)] pl-4">
          <h4 className="font-semibold text-black mb-2" style={{ fontFamily: "var(--font-league-spartan)" }}>Side Effect Profiles</h4>
          <p className="text-sm text-gray-700">
            Some side effects are more prevalent or pronounced in women. Our analysis specifically
            addresses women-centric side effect concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
