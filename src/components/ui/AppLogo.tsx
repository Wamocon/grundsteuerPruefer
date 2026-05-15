interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Grundsteuerbescheid-Prüfer Logo"
      role="img"
    >
      {/* House shape */}
      <path
        d="M20 4L4 16v20h32V16L20 4z"
        fill="var(--primary)"
        opacity="0.15"
      />
      <path
        d="M20 4L4 16"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 4L36 16"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 15v21h28V15"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Checkmark inside house */}
      <path
        d="M14 24l4 4 8-8"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
