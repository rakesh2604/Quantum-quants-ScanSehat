import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import clsx from "clsx";

interface PremiumKPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  miniChart?: Array<{ value: number }>;
  delay?: number;
}

const PremiumKPICard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  miniChart,
  delay = 0,
}: PremiumKPICardProps) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E2E2E2] dark:border-[#3A3A3A] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[#6A6A6A] dark:text-[#9A9A9A] mb-2">{title}</p>
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="text-[28px] font-bold text-[#1E1E1E] dark:text-white leading-none">{value}</h3>
            {change !== undefined && (
              <div className={clsx(
                "flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded",
                isPositive 
                  ? "text-[#3BB273] bg-[#E8F8F0]" 
                  : "text-red-500 bg-red-50 dark:bg-red-900/20"
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          {changeLabel && (
            <p className="text-[12px] text-[#6A6A6A] dark:text-[#9A9A9A]">{changeLabel}</p>
          )}
        </div>
        <div className={clsx("p-3 rounded-xl", iconBgColor)}>
          <Icon className={clsx("w-6 h-6", iconColor)} />
        </div>
      </div>

      {miniChart && miniChart.length > 0 && (
        <div className="mt-4 h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={miniChart}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={iconColor === "text-primary" ? "#2A7FBA" : "#3BB273"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default PremiumKPICard;

