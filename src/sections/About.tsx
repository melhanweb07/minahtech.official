import { ArrowUpRight } from "lucide-react";
import { company } from "../data/company";
import { Reveal } from "../components/Motion";

export default function About() {
  return (
    <section
      id="about"
      className="about-section section-space"
      aria-labelledby="about-title"
    >
      <div className="page-shell about-grid">
        <Reveal className="about-heading">
          <p className="eyebrow">
            <span className="section-number">03</span> ABOUT MINAH TECH
          </p>
          <h2 id="about-title">
            Built for business.
            <br />
            Designed for <span className="accent">impact.</span>
          </h2>
        </Reveal>

        <Reveal className="about-copy" delay={0.08}>
          <p>{company.positioning}</p>
          <div className="about-values" aria-label="Our approach">
            <div>
              <span>01</span>
              <strong>Clear Strategy</strong>
            </div>
            <div>
              <span>02</span>
              <strong>Purposeful Design</strong>
            </div>
            <div>
              <span>03</span>
              <strong>Reliable Delivery</strong>
            </div>
          </div>
          <a className="text-link" href="#contact">
            Work with {company.name} <ArrowUpRight size={17} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
