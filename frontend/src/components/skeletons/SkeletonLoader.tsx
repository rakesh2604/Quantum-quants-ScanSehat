import { motion } from "framer-motion";
import clsx from "clsx";

interface SkeletonLoaderProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export const SkeletonLoader = ({
  className = "",
  height = "20px",
  width = "100%",
  rounded = true,
}: SkeletonLoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "skeleton skeleton-shimmer",
        rounded && "rounded",
        className
      )}
      style={{ height, width }}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="medical-card p-6 space-y-4">
      <SkeletonLoader height="24px" width="60%" />
      <SkeletonLoader height="40px" width="80%" />
      <SkeletonLoader height="16px" width="100%" />
      <SkeletonLoader height="16px" width="70%" />
    </div>
  );
};

export const SkeletonTable = () => {
  return (
    <div className="medical-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonLoader height="24px" width="200px" />
        <SkeletonLoader height="40px" width="300px" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <SkeletonLoader height="40px" width="100%" />
          </div>
        ))}
      </div>
    </div>
  );
};

