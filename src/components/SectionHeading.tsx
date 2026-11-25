import { Reveal } from "./Motion";

export default function SectionHeading({
  number,
  label,
  title,
  description,
  id,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
  id: string;
}) {
  return (
    <Reveal className="section-heading">
      <p className="eyebrow">
        <span className="section-number">{number}</span> {label}
      </p>
      <div className="section-heading-row">
        <h2 id={id}>
          {title}
          <span className="accent">.</span>
        </h2>
        <p>{description}</p>
      </div>
    </Reveal>
  );
}
