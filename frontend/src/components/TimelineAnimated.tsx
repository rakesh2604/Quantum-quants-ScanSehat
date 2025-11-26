import { motion } from "framer-motion";
import { ReactNode } from "react";

export type TimelineItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: ReactNode;
};

type TimelineProps = {
  items: TimelineItem[];
};

const TimelineAnimated = ({ items }: TimelineProps) => (
  <div className="relative border-l border-slate-200 dark:border-white/10">
    {items.map((item, index) => (
      <motion.article
        key={item.id}
        className="ml-8 space-y-1 pb-8"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.3 }}
      >
        <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">{item.icon ?? "•"}</div>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.timestamp}</p>
        <h4 className="text-lg font-semibold text-dark-navy dark:text-white">{item.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
      </motion.article>
    ))}
  </div>
);

export default TimelineAnimated;

