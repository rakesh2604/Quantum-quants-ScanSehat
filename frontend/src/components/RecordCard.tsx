import { motion } from "framer-motion";
import clsx from "clsx";
import { formatDate } from "../utils/date";

const badgeStyles: Record<string, string> = {
  verified: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200",
  "patient-uploaded": "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-100",
  "low-quality": "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-100",
  unknown: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white"
};

type RecordCardProps = {
  record: any;
};

const RecordCard = ({ record }: RecordCardProps) => {
  const integrity = (record.integrity as string) ?? "unknown";
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-panel flex flex-col gap-4" transition={{ duration: 0.2 }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-dark-navy dark:text-white">{record.facility ?? "Encrypted document"}</p>
        <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", badgeStyles[integrity] ?? badgeStyles.unknown)}>
          {integrity.replace("-", " ")}
        </span>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{formatDate(record.createdAt)}</p>
        <p className="text-lg font-semibold text-dark-navy dark:text-white">{record.fileType}</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{record.summary}</p>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <button className="focus-ring hover:text-primary">Share</button>
        <button className="focus-ring hover:text-primary">Download</button>
        <button className="focus-ring hover:text-primary">Details</button>
      </div>
    </motion.div>
  );
};

export default RecordCard;

