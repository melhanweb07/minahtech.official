import { useState } from "react";
import { company } from "../data/company";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 31V7l10 8v16L4 23m12 8V15L26 7v24l-10-8m12 8V7l8 6v24l-8-6"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Brand() {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <a
      className="brand"
      href="#projects"
      aria-label={`${company.name}, back to selected work`}
    >
      {company.logo && !imageFailed ? (
        <img
          src={company.logo}
          alt=""
          width="36"
          height="36"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <BrandMark className="brand-mark" />
      )}
      <span>
        {company.name.split(" ")[0]}{" "}
        <span className="brand-tech">
          {company.name.split(" ").slice(1).join(" ")}
        </span>
      </span>
    </a>
  );
}
