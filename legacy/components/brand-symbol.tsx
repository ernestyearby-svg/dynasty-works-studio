import master from "@legacy/brand-source/modular-master.json";
/** Direction 03 geometry is immutable here; update only the master source with approval. */
export function BrandSymbol({
  animated = false,
  small = false,
}: {
  animated?: boolean;
  small?: boolean;
}) {
  const paths = (
    <>
      <path d={master.outline} strokeWidth={small ? 18 : master.outlineWidth} />
      {!small && <path d={master.dividers} strokeWidth={master.dividerWidth} />}
    </>
  );
  return (
    <svg
      className={"brand-symbol" + (animated ? " brand-motion" : "")}
      viewBox={master.viewBox}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="miter"
      strokeMiterlimit="4"
    >
      {animated
        ? [0, 1, 2].map((i) => (
            <g key={i} className={"brand-module module-" + i}>
              {paths}
            </g>
          ))
        : paths}
    </svg>
  );
}
