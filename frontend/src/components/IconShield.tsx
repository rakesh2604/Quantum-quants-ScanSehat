type IconProps = {
  className?: string;
  size?: number;
};

const IconShield = ({ className = "w-10 h-10 text-primary", size = 40 }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M32 8L52 16V30C52 41.0457 44.6274 51.402 32 56C19.3726 51.402 12 41.0457 12 30V16L32 8Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M24 32L30 38L40 26" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default IconShield;

