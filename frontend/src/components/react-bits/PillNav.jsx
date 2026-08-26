/**
 * PillNav – pill-shaped floating navigation bar.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: theme tokens, accessibility.
 *
 * Attribution: reactbits.dev  /  MIT licence
 */
import { memo } from "react";

/**
 * PillNav renders a horizontal pill container.
 * Children are displayed as a flex row with gap.
 * Use the `className` prop to position it (e.g. fixed top bar).
 */
function PillNav({ children, className = "" }) {
  return (
    <nav
      className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/70 px-3 py-1.5 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 dark:bg-void/70 dark:border-white/10 ${className}`}
      aria-label="Main navigation"
    >
      {children}
    </nav>
  );
}

export default memo(PillNav);
