/**
 * LogoLoop – an accessible, CSS-driven continuous logo rail inspired by
 * React Bits' Logo Loop. Motion pauses on hover/focus and for reduced motion.
 */
import { memo } from "react";

function LogoLoop({ items = [], className = "" }) {
  if (!items.length) return null;

  const renderItems = (copy) =>
    items.map((item, index) => (
      <div
        key={`${copy}-${item.id ?? item.name}-${index}`}
        className="logo-loop-item"
        aria-hidden={copy === "duplicate" ? "true" : undefined}
      >
        {item.icon ? (
          <img src={item.icon} alt="" className="h-8 w-8 object-contain" loading="lazy" />
        ) : null}
        <span className="whitespace-nowrap font-body text-sm font-semibold text-slate-700 dark:text-slate-200">
          {item.name}
        </span>
      </div>
    ));

  return (
    <div className={`logo-loop ${className}`} aria-label="Technology stack">
      <div className="logo-loop-track">
        <div className="logo-loop-group">{renderItems("primary")}</div>
        <div className="logo-loop-group" aria-hidden="true">{renderItems("duplicate")}</div>
      </div>
    </div>
  );
}

export default memo(LogoLoop);
