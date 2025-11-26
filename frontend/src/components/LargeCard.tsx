import { ReactNode } from "react";
import { motion } from "framer-motion";

type LargeCardProps = {
  title: string;
  subtitle?: string;
  cta?: ReactNode;
  children: ReactNode;
};

const LargeCard = ({ title, subtitle, cta, children }: LargeCardProps) => (
  <motion.section
    className="glass-panel flex flex-col gap-4"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35 }}
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-xl font-semibold text-dark-navy dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-300">{subtitle}</p>}
      </div>
      {cta}
    </div>
    {children}
  </motion.section>
);

export default LargeCard;

