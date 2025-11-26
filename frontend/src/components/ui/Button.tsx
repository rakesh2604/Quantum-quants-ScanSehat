import { ReactNode, ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "white-outline";
  children: ReactNode;
  to?: string;
  ariaLabel?: string;
}

const Button = ({ variant = "primary", children, to, ariaLabel, className = "", ...props }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-[#0C6CF2] text-white hover:bg-[#0A5CD9] focus:ring-[#0C6CF2] shadow-sm hover:shadow-md",
    secondary: "bg-white text-[#0C6CF2] border-2 border-[#0C6CF2] hover:bg-[#0C6CF2] hover:text-white focus:ring-[#0C6CF2]",
    outline: "bg-transparent border border-[#0C6CF2] text-[#0C6CF2] hover:bg-[#0C6CF2]/10 focus:ring-[#0C6CF2]",
    "white-outline": "bg-transparent border border-white text-white hover:bg-white/10 focus:ring-white",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

