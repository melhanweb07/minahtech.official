export default function SocialMark({ name }: { name: string }) {
  const sharedProps = {
    className: "social-mark",
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "Instagram":
      return (
        <svg {...sharedProps} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...sharedProps} fill="currentColor">
          <path d="M5 8.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM3.5 10h3v10h-3zM9 10h2.9v1.36h.04A3.18 3.18 0 0 1 14.8 9.8c3.1 0 3.7 2.04 3.7 4.7V20h-3v-4.87c0-1.16-.02-2.66-1.62-2.66-1.62 0-1.87 1.27-1.87 2.58V20H9z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...sharedProps} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77A26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81Z" />
          <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...sharedProps} fill="currentColor">
          <path d="M13.5 21v-8h2.8l.42-3H13.5V8.08c0-.87.29-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.38-.14-2.62-.14-2.6 0-4.38 1.59-4.38 4.51V10H7v3h2.8v8z" />
        </svg>
      );
    case "GitHub":
      return (
        <svg {...sharedProps} fill="currentColor">
          <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.77.76 2.58 1.08.1-.73.39-1.23.7-1.52-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.3-2.62 5.25-5.11 5.53.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
        </svg>
      );
    default:
      return null;
  }
}
