import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  chart?: React.ReactNode;
  delay?: number;
}

const KPICard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "text-primary",
  description,
  chart,
  delay = 0,
}: KPICardProps) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="medical-card-hover p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-label text-text-secondary mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-title-lg text-text-dark dark:text-text-light font-bold">{value}</h3>
            {change !== undefined && (
              <div className={clsx("flex items-center gap-1 text-label", isPositive ? "text-success" : "text-red-500")}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          {changeLabel && (
            <p className="text-label text-text-secondary mt-1">{changeLabel}</p>
          )}
        </div>
        <div className={clsx("p-3 rounded-lg", iconColor === "text-primary" ? "bg-primary-light dark:bg-primary/10" : "bg-success-light")}>
          <Icon className={clsx("w-6 h-6", iconColor)} />
        </div>
      </div>

      {description && (
        <p className="text-body text-text-secondary mb-4">{description}</p>
      )}

      {chart && <div className="mt-4">{chart}</div>}
    </motion.div>
  );
};

export default KPICard;

