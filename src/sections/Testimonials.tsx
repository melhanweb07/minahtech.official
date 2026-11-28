import { useState } from "react";
import { AnimatePresence, m as motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { testimonials } from "../data/testimonials";
import type { Testimonial } from "../data/types";
import SectionHeading from "../components/SectionHeading";
import TestimonialCard from "../components/TestimonialCard";
import VideoModal from "../components/VideoModal";
import { Reveal } from "../components/Motion";

const publishedReviews = testimonials.filter(
  (review) => review.approved && review.review && review.name,
);

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [video, setVideo] = useState<Testimonial | null>(null);
  const reduced = useReducedMotion();
  const change = (direction: number) =>
    setIndex(
      (current) =>
        (current + direction + publishedReviews.length) %
        publishedReviews.length,
    );

  return (
    <section
      id="testimonials"
      className="testimonials-section section-space page-shell"
      aria-labelledby="testimonials-title"
    >
      <SectionHeading
        number="04"
        label="RELATIONSHIPS THAT MATTER"
        title="Trusted by Businesses"
        description="Nothing speaks louder than the experience of our clients."
        id="testimonials-title"
      />
      {publishedReviews.length ? (
        <Reveal className="testimonial-carousel">
          <div aria-roledescription="carousel" aria-label="Client testimonials">
            <div
              className="testimonial-slide"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: reduced ? 0 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduced ? 0 : -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TestimonialCard
                    testimonial={publishedReviews[index]}
                    onPlay={setVideo}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            {publishedReviews.length > 1 && (
              <div className="carousel-controls">
                <span>
                  {String(index + 1).padStart(2, "0")}{" "}
                  <span>
                    / {String(publishedReviews.length).padStart(2, "0")}
                  </span>
                </span>
                <div>
                  <button
                    className="icon-button"
                    aria-label="Previous testimonial"
                    onClick={() => change(-1)}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Next testimonial"
                    onClick={() => change(1)}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      ) : (
        <Reveal className="testimonials-empty">
          <span className="quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          <div>
            <h3>Real people. Honest feedback.</h3>
            <p>
              Client stories will appear here as they're shared with us.
              <br />
              Until then, we'll let the work do the talking.
            </p>
          </div>
          <a href="#projects" className="text-link">
            Explore our work <ArrowUpRight size={17} />
          </a>
        </Reveal>
      )}
      <VideoModal testimonial={video} onClose={() => setVideo(null)} />
    </section>
  );
}
