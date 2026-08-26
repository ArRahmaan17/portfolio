/**
 * ElectricBorder – animated gradient border via ::before pseudo-element.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: reduced-motion (static), theme tokens.
 *
 * Attribution: reactbits.dev  /  MIT licence
 */
import { memo } from "react";

function ElectricBorder({ children, className = "", radius = "1rem" }) {
  return (
    <div
      className={`electric-border ${className}`}
      style={{ borderRadius: radius }}
    >
      {children}
    </div>
  );
}

export default memo(ElectricBorder);
