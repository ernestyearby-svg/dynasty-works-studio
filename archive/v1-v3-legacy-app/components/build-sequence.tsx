import { BrandSymbol } from "@/components/brand-symbol";
export const buildSequence = [
  "Idea",
  "Company",
  "Brand",
  "Build",
  "Launch",
  "Market",
  "Growth",
];
export function BuildSequence() {
  return (
    <ol className="dw-sequence">
      {buildSequence.map((stage, i) => (
        <li key={stage}>
          <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
          <span>{stage}</span>
        </li>
      ))}
    </ol>
  );
}
export function BlueprintCover({
  clientCompany,
  date,
  template = false,
}: { clientCompany?: string; date?: string; template?: boolean } = {}) {
  return (
    <div
      className="dw-document"
      aria-label="Dynasty Works Founder Blueprint cover"
    >
      <div className="document-brand">
        <BrandSymbol />
        <strong>DYNASTY WORKS</strong>
        <span className="eyebrow">STUDIO / STRATEGIC SERIES 01</span>
      </div>
      <p>
        FOUNDER
        <br />
        <em>BLUEPRINT</em>
      </p>
      {(template || clientCompany || date) && (
        <div className="document-fields">
          <div>{clientCompany || "[CLIENT / COMPANY]"}</div>
          <div>{date || "[DATE]"}</div>
        </div>
      )}
      <div className="dw-document-grid" aria-hidden="true">
        <span>IDEA</span>
        <span>BUILD</span>
        <span>GROW</span>
      </div>
      <footer>
        <span>
          FROM IDEA
          <br />
          TO EXECUTION.
        </span>
        <span>30 / 60 / 90</span>
      </footer>
    </div>
  );
}
