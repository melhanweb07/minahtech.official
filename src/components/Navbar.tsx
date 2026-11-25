import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m as motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "../data/company";
import Brand from "./Brand";
import { MagneticLink } from "./Motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("projects");
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let scheduled = false;
    const update = () => {
      setScrolled(window.scrollY > 20);
      let current = "projects";
      for (const item of navigation) {
        const section = document.getElementById(item.id);
        if (
          section &&
          section.getBoundingClientRect().top < window.innerHeight * 0.42
        )
          current = item.id;
      }
      setActive(current);
      scheduled = false;
    };
    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 800) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="page-shell nav-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? "is-active" : ""}
              aria-current={active === item.id ? "location" : undefined}
            >
              {item.label}
              <span className="nav-dot" />
            </a>
          ))}
        </nav>
        <MagneticLink href="#contact" className="nav-cta">
          Start a Project <ArrowUpRight size={16} />
        </MagneticLink>
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: reduced ? "auto" : 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: reduced ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="page-shell mobile-nav-inner">
              {navigation.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === item.id ? "location" : undefined}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                  <ArrowUpRight size={19} />
                </a>
              ))}
              <a
                className="button button-primary"
                href="#contact"
                onClick={() => setOpen(false)}
              >
                Start a Project <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
