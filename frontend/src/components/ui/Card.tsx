import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

const Card = ({ children, className = "", hover = false, glass = false }: CardProps) => {
  const baseClasses = glass 
    ? "glass-card p-6"
    : "bg-white rounded-xl shadow-card border border-gray-100 p-6";
  const hoverClasses = hover ? "transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg" : "";
  
  return (
    <div className={clsx(baseClasses, hoverClasses, className)}>
      {children}
    </div>
  );
};

export default Card;

