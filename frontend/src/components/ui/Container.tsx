import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div className={`mx-auto max-w-7xl px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;

