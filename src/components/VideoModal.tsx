import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Testimonial } from "../data/types";
import Modal from "./Modal";

function embedUrl(video: NonNullable<Testimonial["video"]>) {
  try {
    const url = new URL(video.url);
    if (video.type === "youtube") {
      const allowed = [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "youtu.be",
        "www.youtube-nocookie.com",
      ];
      if (!allowed.includes(url.hostname)) return "";
      const id =
        url.hostname === "youtu.be"
          ? url.pathname.slice(1)
          : url.searchParams.get("v") || url.pathname.split("/").pop();
      return id && /^[\w-]{11}$/.test(id)
        ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
        : "";
    }
    if (
      video.type === "vimeo" &&
      ["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)
    ) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id && /^\d+$/.test(id)
        ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`
        : "";
    }
  } catch {
    return "";
  }
  return "";
}

function VideoPlayer({ testimonial }: { testimonial: Testimonial }) {
  const [error, setError] = useState(false);
  const video = testimonial.video;
  if (!video) return null;
  const embed = video.type !== "mp4" ? embedUrl(video) : "";
  const safeUrl = /^(https?:\/\/|\/[^/])/.test(video.url);
  return (
    <div className="video-player">
      {video.type === "mp4" && safeUrl && !error ? (
        <video
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={video.thumbnail}
          onError={() => setError(true)}
          aria-label={`Testimonial from ${testimonial.name}`}
        >
          <source src={video.url} type="video/mp4" />
          {video.captions && (
            <track
              kind="captions"
              src={video.captions}
              srcLang="en"
              label="English"
              default
            />
          )}
          Your browser does not support this video.
        </video>
      ) : embed ? (
        <iframe
          src={embed}
          title={`Video testimonial from ${testimonial.name}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <p className="video-error" role="status">
          This video cannot be played here.
          {safeUrl && (
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Open the original video <ExternalLink size={14} />
            </a>
          )}
        </p>
      )}
      <p className="video-transcript">
        <strong>Client review</strong>
        {testimonial.review}
      </p>
    </div>
  );
}

export default function VideoModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={!!testimonial}
      onClose={onClose}
      titleId="video-dialog-title"
      className="video-modal"
    >
      {testimonial && (
        <>
          <div className="modal-heading">
            <p className="eyebrow">IN THEIR OWN WORDS</p>
            <h2 id="video-dialog-title">{testimonial.name}</h2>
            <p className="muted">{testimonial.company}</p>
          </div>
          <VideoPlayer key={testimonial.id} testimonial={testimonial} />
        </>
      )}
    </Modal>
  );
}
