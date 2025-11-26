import { motion } from "framer-motion";
import { Check, X, Clock, Phone, MapPin } from "lucide-react";
import clsx from "clsx";

interface AppointmentCardProps {
  patientName: string;
  condition: string;
  phone: string;
  date: string;
  time: string;
  status: "accepted" | "pending";
  onAccept?: () => void;
  onReject?: () => void;
  delay?: number;
}

const AppointmentCard = ({
  patientName,
  condition,
  phone,
  date,
  time,
  status,
  onAccept,
  onReject,
  delay = 0,
}: AppointmentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E2E2E2] dark:border-[#3A3A3A] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{patientName.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold text-[#1E1E1E] dark:text-white mb-1">{patientName}</h4>
            <p className="text-[13px] text-[#6A6A6A] dark:text-[#9A9A9A] mb-2">{condition}</p>
            <div className="flex items-center gap-4 text-[12px] text-[#6A6A6A] dark:text-[#9A9A9A]">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{date} - {time}</span>
              </div>
            </div>
          </div>
        </div>
        {status === "accepted" ? (
          <span className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#E8F8F0] text-[#3BB273] flex items-center gap-1">
            <Check className="w-3 h-3" />
            Accepted
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onAccept}
              className="p-2 rounded-lg bg-[#E8F8F0] hover:bg-[#3BB273] text-[#3BB273] hover:text-white transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onReject}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentCard;

