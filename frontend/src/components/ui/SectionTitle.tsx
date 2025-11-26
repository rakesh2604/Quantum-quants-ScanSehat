import { ReactNode } from "react";

interface SectionTitleProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

const SectionTitle = ({ title, subtitle, className = "" }: SectionTitleProps) => {
  return (
    <div className={`text-center mb-12 md:mb-16 ${className}`}>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;

