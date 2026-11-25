import { m as motion, useReducedMotion } from "framer-motion";
import { useState, type MouseEvent, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{
        opacity: immediate ? 1 : 0,
        y: reduced ? 0 : immediate ? 12 : 24,
      }}
      animate={immediate ? { opacity: 1, y: 0 } : undefined}
      whileInView={immediate ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: reduced ? 0.01 : 0.65,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function MagneticLink({
  children,
  href,
  className = "",
  onClick,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  const reduced = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  function onMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: (event.clientX - rect.left - rect.width / 2) * 0.08,
      y: (event.clientY - rect.top - rect.height / 2) * 0.12,
    });
  }
  return (
    <motion.a
      href={href}
      className={`button button-primary ${className}`}
      animate={position}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onMouseMove={onMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      onClick={onClick}
    >
      {children}
    </motion.a>
  );
}
