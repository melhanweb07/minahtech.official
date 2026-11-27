import { ArrowUp, ArrowUpRight } from "lucide-react";
import { company, navigation } from "../data/company";
import Brand, { BrandMark } from "./Brand";
import SocialMark from "./SocialMark";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand />
            <p>{company.description}</p>
            <span>Founded by {company.founder}</span>
          </div>
          <nav className="footer-navigation" aria-label="Footer navigation">
            <p className="footer-label">EXPLORE</p>
            {navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="footer-social">
            <p className="footer-label">ELSEWHERE</p>
            {company.socials.map((social) =>
              social.url ? (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialMark name={social.name} />
                  <span>{social.name}</span>
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              ) : (
                <span
                  key={social.name}
                  className="social-unavailable"
                  title="Profile link not supplied"
                >
                  <SocialMark name={social.name} />
                  {social.name}
                </span>
              ),
            )}
            {company.socials.some(
              (social) => social.name === "GitHub" && !social.url,
            ) && (
              <small>GitHub link coming soon</small>
            )}
          </div>
          <a
            className="back-to-top"
            href="#projects"
            aria-label="Back to top of selected work"
          >
            <ArrowUp size={19} />
            <span>Back to top</span>
          </a>
        </div>
        <p className="footer-manifesto">
          <span className="accent-dot" />
          {company.message}
        </p>
        <div className="footer-statement" aria-hidden="true">
          {company.name}
          {company.logo ? (
            <img
              className="footer-large-mark"
              src={company.logo}
              alt=""
              width="183"
              height="183"
            />
          ) : (
            <BrandMark className="footer-large-mark" />
          )}
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {company.copyrightYear} {company.name}. All rights reserved.
          </p>
          <p>Built with purpose. By {company.name}.</p>
        </div>
      </div>
    </footer>
  );
}
