import { ArrowUpRight, Check } from "lucide-react";
import type { Project } from "../data/types";
import Modal from "./Modal";
import { ProjectVisual } from "./ProjectCard";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={!!project}
      onClose={onClose}
      titleId="project-dialog-title"
      className="project-modal"
    >
      {project && (
        <>
          <div className="modal-heading">
            <p className="eyebrow">
              SELECTED WORK <span>/</span> {project.category}
            </p>
            <h2 id="project-dialog-title">{project.name}</h2>
          </div>
          <ProjectVisual project={project} eager />
          <div className="modal-body">
            <p className="project-status">
              <Check size={14} /> Completed project
            </p>
            <p className="modal-description">{project.description}</p>
            <dl className="project-facts">
              <div>
                <dt>Client</dt>
                <dd>{project.client}</dd>
              </div>
              <div>
                <dt>Project type</dt>
                <dd>{project.category}</dd>
              </div>
              {project.technologies.length > 0 && (
                <div>
                  <dt>Technology</dt>
                  <dd>{project.technologies.join(", ")}</dd>
                </div>
              )}
            </dl>
            {project.imageType === "placeholder" && (
              <p className="image-disclosure">
                This photograph is an illustrative cover, not a screenshot or a
                representation of the client's premises. Project imagery will be
                added when supplied.
              </p>
            )}
            {!project.url && (
              <p className="image-disclosure">
                A public website link has not been supplied. Get in touch if you
                would like to learn more about this project.
              </p>
            )}
            <div className="modal-actions">
              {project.url && (
                <a
                  className="button button-primary"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Live Website <ArrowUpRight size={17} />
                </a>
              )}
              {project.caseStudyUrl && (
                <a
                  className="button button-outline"
                  href={project.caseStudyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Case Study <ArrowUpRight size={17} />
                </a>
              )}
              <a className="text-link" href="#contact" onClick={onClose}>
                Discuss a similar project <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
