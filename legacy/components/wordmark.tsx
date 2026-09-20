import { BrandSymbol } from "@legacy/components/brand-symbol";
export function Wordmark({ symbol = true }: { symbol?: boolean }) {
  return (
    <span className="production-lockup">
      {symbol && <BrandSymbol />}
      <span className="identity-lockup">
        <span>DYNASTY WORKS</span>
        <small>STUDIO</small>
      </span>
    </span>
  );
}
