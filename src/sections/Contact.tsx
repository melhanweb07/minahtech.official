import { ArrowUpRight, Globe2, Mail, Phone } from "lucide-react";
import { company } from "../data/company";
import { projects } from "../data/projects";
import { Reveal } from "../components/Motion";
import ContactForm from "../components/ContactForm";

const showContactForm = false;

export default function Contact({
  selectedService,
}: {
  selectedService: { name: string };
}) {
  return (
    <section
      id="contact"
      className="contact-section section-space"
      aria-labelledby="contact-title"
    >
      <div
        className={`page-shell contact-grid ${showContactForm ? "" : "contact-grid--form-hidden"}`}
      >
        <Reveal className="contact-copy">
          <p className="eyebrow">
            <span className="section-number">04</span> LET'S MAKE IT HAPPEN
          </p>
          <h2 id="contact-title">
            Have a Project
            <br />
            in Mind<span className="accent">?</span>
          </h2>
          <p className="contact-introduction">
            Let's turn your ideas into something meaningful. Tell us what you're
            building, and let's make it happen.
          </p>
          <div className="contact-information">
            <a href={`mailto:${company.email}`}>
              <Mail size={19} strokeWidth={1.5} />
              <span>{company.email}</span>
              <ArrowUpRight size={16} />
            </a>
            <a href={company.phoneHref}>
              <Phone size={18} strokeWidth={1.5} />
              <span>{company.phone}</span>
              <ArrowUpRight size={16} />
            </a>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <Globe2 size={19} strokeWidth={1.5} />
              <span>
                {company.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="founder-signature">
            <span className="founder-monogram" aria-hidden="true">
              {company.founder
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div>
              <p>{company.founder}</p>
              <span>Founder, {company.name}</span>
            </div>
          </div>
          <p className="contact-note">
            Big ambition. Thoughtful solutions.
            <br />A real person on the other side.
          </p>
        </Reveal>
        {!showContactForm && (
          <div
            className="contact-gallery"
            role="group"
            aria-label="MINAH TECH project gallery"
          >
            <div className="contact-gallery-ring">
              {projects.map((project) => (
                <figure className="contact-gallery-card" key={project.id}>
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
        )}
        {showContactForm && (
          <Reveal className="contact-form-wrap" delay={0.1}>
            <ContactForm selectedService={selectedService} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
