import { m as motion, useReducedMotion } from "framer-motion";
import { company } from "../data/company";

export default function WhatsAppButton() {
  const reduced = useReducedMotion();
  return (
    <motion.a
      className="whatsapp-button"
      href={company.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Let's Talk on WhatsApp (opens in a new tab)"
      animate={{ y: reduced ? 0 : [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      whileHover={reduced ? {} : { scale: 1.07 }}
    >
      <span className="whatsapp-tooltip">Let's Talk on WhatsApp</span>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.9 11.9 0 0 0 12.06 0C5.47 0 .1 5.36.1 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.94 11.94 0 0 0 5.85 1.49h.01C18.65 23.86 24 18.5 24 11.92a11.86 11.86 0 0 0-3.48-8.44ZM12.06 21.84h-.01a9.93 9.93 0 0 1-5.06-1.38l-.36-.21-3.68.96.98-3.59-.24-.37a9.86 9.86 0 0 1-1.52-5.3c0-5.48 4.46-9.94 9.95-9.94a9.86 9.86 0 0 1 7.03 2.91 9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.46 9.89-10 9.89Zm5.45-7.45c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.1 4.49.71.3 1.27.48 1.7.61.72.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </motion.a>
  );
}
