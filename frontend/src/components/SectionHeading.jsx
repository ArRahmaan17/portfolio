import AnimatedContent from "./react-bits/AnimatedContent";

export default function SectionHeading({ eyebrow, title, description, align = "left", className = "" }) {
  const centered = align === "center";

  return (
    <AnimatedContent className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? (
        <p className={`section-copy ${centered ? "mx-auto" : ""}`}>{description}</p>
      ) : null}
    </AnimatedContent>
  );
}
