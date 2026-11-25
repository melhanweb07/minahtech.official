import { useRef, useState, type Ref } from "react";
import {
  m as motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, ImageOff } from "lucide-react";
import type { Project } from "../data/types";

export function ProjectVisual({
  project,
  eager = false,
}: {
  project: Project;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const responsiveImage = {
    srcSet: project.imageSmall
      ? `${project.imageSmall} 700w, ${project.image} 1400w`
      : undefined,
    sizes:
      "(max-width: 540px) calc(100vw - 40px), (max-width: 800px) 50vw, 60vw",
  };

  return (
    <div
      ref={ref}
      className={`project-visual theme-${project.theme} ${project.imageType === "screenshot" ? "is-screenshot" : "is-photograph"}`}
    >
      {failed ? (
        <div className="image-fallback">
          <ImageOff size={32} strokeWidth={1} />
          <span>{project.name}</span>
          <small>Project preview unavailable</small>
        </div>
      ) : project.imageType === "screenshot" ? (
        <motion.div
          className="screenshot-composition"
          style={{ y: reduced ? 0 : y }}
        >
          <div className="browser-window">
            <div className="browser-bar" aria-hidden="true">
              <span className="browser-dots">
                <i />
                <i />
                <i />
              </span>
              <span>
                {project.url ? new URL(project.url).hostname : project.name}
              </span>
              <span className="browser-plus">+</span>
            </div>
            <img
              src={project.image}
              {...responsiveImage}
              alt={project.imageAlt}
              width="1400"
              height="972"
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              decoding="async"
              onError={() => setFailed(true)}
            />
          </div>
        </motion.div>
      ) : (
        <motion.img
          className="project-photo"
          src={project.image}
          {...responsiveImage}
          alt={project.imageAlt}
          width="1400"
          height="900"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          style={{ y: reduced ? 0 : y }}
          onError={() => setFailed(true)}
        />
      )}
      <div className="preview-hint" aria-hidden="true">
        <ArrowUpRight size={23} strokeWidth={1.5} />
      </div>
    </div>
  );
}

export default function ProjectCard({
  project,
  index,
  onOpen,
  ref,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  ref?: Ref<HTMLElement>;
}) {
  const reduced = useReducedMotion();
  const projectVisual = <ProjectVisual project={project} eager={index < 2} />;
  return (
    <motion.article
      ref={ref}
      className="project-card"
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduced ? 0.01 : 0.5, delay: (index % 2) * 0.09 }}
    >
      {project.url ? (
        <a
          className="project-image-button"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name} website in a new tab`}
        >
          {projectVisual}
        </a>
      ) : (
        <button
          className="project-image-button"
          onClick={() => onOpen(project)}
          aria-label={`View ${project.name} project details`}
        >
          {projectVisual}
        </button>
      )}
      <div className="project-info">
        <div className="project-overline">
          <span>{project.category}</span>
          {project.imageType === "placeholder" && (
            <span className="cover-note">Illustrative cover</span>
          )}
        </div>
        <div className="project-title-line">
          <h2>
            <button onClick={() => onOpen(project)}>{project.name}</button>
          </h2>
          <button
            className="project-arrow"
            onClick={() => onOpen(project)}
            aria-label={`Read about ${project.name}`}
          >
            <ArrowUpRight size={23} strokeWidth={1.5} />
          </button>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-bottom">
          <p className="project-technologies">
            {project.technologies.length
              ? project.technologies.join(" / ")
              : project.client}
          </p>
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View Live Website <ArrowUpRight size={13} />
            </a>
          ) : (
            <button className="project-link" onClick={() => onOpen(project)}>
              View Project <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
