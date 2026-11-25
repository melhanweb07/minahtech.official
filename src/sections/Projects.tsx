import { useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { projects, projectFilters } from "../data/projects";
import { company } from "../data/company";
import type { Project } from "../data/types";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { Reveal } from "../components/Motion";

const completedProjects = projects.filter((project) => project.completed);

export default function Projects() {
  const [filter, setFilter] = useState("All Work");
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = completedProjects.filter(
    (project) => filter === "All Work" || project.filter === filter,
  );

  return (
    <section
      id="projects"
      className="projects-section page-shell"
      aria-labelledby="projects-title"
    >
      <Reveal className="projects-intro" immediate>
        <p className="eyebrow">
          <span className="accent-dot" /> {company.name}{" "}
          <span className="eyebrow-slash">/</span> INDEPENDENT DIGITAL STUDIO
        </p>
        <div className="projects-heading-row">
          <h1 id="projects-title">
            Ideas Into Impact<span className="accent">.</span>
          </h1>
          <p>
            Real projects. Real businesses.
            <br />
            <span>Digital experiences built with purpose.</span>
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.12} className="project-toolbar">
        <div
          className="project-filters"
          role="group"
          aria-label="Filter projects by category"
        >
          {projectFilters.map((item) => (
            <button
              key={item}
              className={`filter-button ${filter === item ? "selected" : ""}`}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
              {item === "All Work" && (
                <span className="filter-count">
                  {String(completedProjects.length).padStart(2, "0")}
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="toolbar-note">
          A little of what we've built <ArrowDown size={14} />
        </span>
      </Reveal>
      <p className="sr-only" role="status">
        Showing {visible.length}{" "}
        {filter === "All Work" ? "completed" : filter.toLowerCase()} projects.
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={filter}
          className="projects-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          {visible.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setSelected}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      <Reveal className="projects-closing">
        <span>Different businesses. The same attention to detail.</span>
        <a href="#contact" className="text-link">
          Your project could be next <ArrowDown size={15} />
        </a>
      </Reveal>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
