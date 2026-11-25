import { useState } from "react";
import {
  LazyMotion,
  domAnimation,
  MotionConfig,
  m as motion,
  useReducedMotion,
} from "framer-motion";
import Navbar from "./components/Navbar";
import Projects from "./sections/Projects";
import Services from "./sections/Services";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function App() {
  const [selectedService, setSelectedService] = useState({ name: "" });
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <motion.div
          className="page-load-line"
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{
            scaleX: { duration: reduced ? 0 : 0.65 },
            opacity: { delay: reduced ? 0 : 0.65, duration: 0.25 },
          }}
        />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Projects />
          <Services onDiscuss={(name) => setSelectedService({ name })} />
          <Testimonials />
          <Contact selectedService={selectedService} />
        </main>
        <Footer />
        <aside aria-label="Quick contact">
          <WhatsAppButton />
        </aside>
      </MotionConfig>
    </LazyMotion>
  );
}
