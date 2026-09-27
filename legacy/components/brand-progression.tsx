import { BrandSymbol } from "@legacy/components/brand-symbol";
export function BrandProgression({ complete = false }: { complete?: boolean }) {
  return (
    <div className={"brand-progression" + (complete ? " is-complete" : "")}>
      <BrandSymbol animated={complete} />
      <span>
        <span className="brand-resolve">DYNASTY WORKS</span>
        <span className="brand-stage-label">
          IDEA <span aria-hidden="true">→</span> BUILD{" "}
          <span aria-hidden="true">→</span> GROW
        </span>
      </span>
    </div>
  );
}
