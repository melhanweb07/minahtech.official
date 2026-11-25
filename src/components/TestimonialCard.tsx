import { Play } from "lucide-react";
import type { Testimonial } from "../data/types";

export default function TestimonialCard({
  testimonial,
  onPlay,
}: {
  testimonial: Testimonial;
  onPlay: (testimonial: Testimonial) => void;
}) {
  return (
    <article
      className={`testimonial-item ${testimonial.video ? "has-video" : ""}`}
    >
      <div className="testimonial-content">
        <span className="quote-mark" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote>{testimonial.review}</blockquote>
        <div className="reviewer">
          {testimonial.image && (
            <img
              src={testimonial.image}
              alt=""
              width="48"
              height="48"
              loading="lazy"
            />
          )}
          <div>
            <p>{testimonial.name}</p>
            <span>{testimonial.company}</span>
          </div>
        </div>
      </div>
      {testimonial.video && (
        <button
          className="video-preview"
          onClick={() => onPlay(testimonial)}
          aria-label={`In their own words: watch the testimonial from ${testimonial.name}`}
        >
          <img
            src={testimonial.video.thumbnail}
            alt={`Video testimonial from ${testimonial.name}`}
            loading="lazy"
            width="640"
            height="360"
          />
          <span className="play-button">
            <Play size={23} fill="currentColor" />
          </span>
          <span className="video-preview-label">In their own words</span>
        </button>
      )}
    </article>
  );
}
