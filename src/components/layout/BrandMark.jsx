export function BrandMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="10" cy="9.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7.6 9.5h4.8M10 7.1v4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M14.4 14.1 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
