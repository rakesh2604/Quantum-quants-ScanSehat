type IconProps = {
  className?: string;
  size?: number;
};

const IconDocument = ({ className = "w-10 h-10 text-primary", size = 40 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="14" y="8" width="36" height="48" rx="6" stroke="currentColor" strokeWidth="4" />
    <path d="M22 20H42M22 30H42M22 40H34" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
    <path d="M38 8V20H50" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

export default IconDocument;

