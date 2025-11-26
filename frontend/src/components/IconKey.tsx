type IconProps = {
  className?: string;
  size?: number;
};

const IconKey = ({ className = "w-10 h-10 text-primary", size = 40 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="28" cy="24" r="16" stroke="currentColor" strokeWidth="4" />
    <path d="M38 34L54 50L50 54L42 46L38 50L34 46L38 42L30 34" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="20" r="4" fill="currentColor" />
  </svg>
);

export default IconKey;

