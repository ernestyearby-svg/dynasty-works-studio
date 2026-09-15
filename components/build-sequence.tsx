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
export function BlueprintCover() {
  return (
    <div
      className="dw-document"
      aria-label="Founder Blueprint document design direction"
    >
      <div className="eyebrow">
        DYNASTY WORKS / STUDIO<span>STRATEGIC SERIES — 01</span>
      </div>
      <p>
        FOUNDER
        <br />
        <em>BLUEPRINT.</em>
      </p>
      <div className="dw-document-grid" aria-hidden="true">
        <span>IDEA</span>
        <span>COMPANY</span>
        <span>MARKET</span>
      </div>
      <footer>
        <span>A COMPANY, CONSIDERED.</span>
        <span>30 / 60 / 90</span>
      </footer>
    </div>
  );
}
