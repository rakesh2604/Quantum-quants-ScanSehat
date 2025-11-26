type IconProps = {
  className?: string;
  size?: number;
};

const IconQR = ({ className = "w-10 h-10 text-primary", size = 40 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="8" y="8" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="4" />
    <rect x="38" y="8" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="4" />
    <rect x="8" y="38" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="4" />
    <path d="M38 38H56V56H46V46H38V56H32" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="17" cy="17" r="4" fill="currentColor" />
  </svg>
);

export default IconQR;

