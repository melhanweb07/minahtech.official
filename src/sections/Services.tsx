import { useState } from "react";
import { services } from "../data/services";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";

export default function Services({
  onDiscuss,
}: {
  onDiscuss: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <section
      id="services"
      className="services-section section-space"
      aria-labelledby="services-title"
    >
      <div className="page-shell">
        <SectionHeading
          number="02"
          label="OUR EXPERTISE"
          title="What We Do"
          description="From the first idea to the final product, we build digital solutions that help businesses grow."
          id="services-title"
        />
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              expanded={expanded === service.id}
              onToggle={() =>
                setExpanded(expanded === service.id ? null : service.id)
              }
              onDiscuss={onDiscuss}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
