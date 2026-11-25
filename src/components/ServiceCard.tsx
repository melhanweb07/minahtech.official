import { AnimatePresence, m as motion, useReducedMotion } from "framer-motion";
import {
  AppWindow,
  ArrowUpRight,
  Check,
  Code2,
  Globe2,
  Layers3,
  Minus,
  PenTool,
  Plus,
  Smartphone,
} from "lucide-react";
import type { Service } from "../data/types";

const icons = {
  globe: Globe2,
  app: AppWindow,
  phone: Smartphone,
  layers: Layers3,
  code: Code2,
  pen: PenTool,
};

export default function ServiceCard({
  service,
  index,
  expanded,
  onToggle,
  onDiscuss,
}: {
  service: Service;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onDiscuss: (name: string) => void;
}) {
  const Icon = icons[service.icon];
  const reduced = useReducedMotion();
  return (
    <motion.article
      className={`service-item ${expanded ? "expanded" : ""}`}
      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay: reduced ? 0 : (index % 3) * 0.08 }}
    >
      <div className="service-top">
        <Icon size={29} strokeWidth={1.3} />
        <span>0{index + 1}</span>
      </div>
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`service-${service.id}`}
        >
          {service.name}
          <span className="service-expand">
            {expanded ? <Minus size={17} /> : <Plus size={17} />}
          </span>
        </button>
      </h3>
      <p className="service-description">{service.description}</p>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`service-${service.id}`}
            className="service-details"
            initial={{ height: reduced ? "auto" : 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: reduced ? "auto" : 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <p>{service.details}</p>
              <ul>
                {service.deliverables.map((item) => (
                  <li key={item}>
                    <Check size={13} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="text-link"
                onClick={() => onDiscuss(service.name)}
              >
                Let's talk about it <ArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="service-discover"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={`${expanded ? "A little less detail" : "Explore service"}: ${service.name}`}
      >
        {expanded ? "A little less detail" : "Explore service"}
        <ArrowUpRight size={14} />
      </button>
    </motion.article>
  );
}
