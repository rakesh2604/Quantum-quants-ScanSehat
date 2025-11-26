import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "./Toast";

const OTPGenerator = ({ otp }: { otp: string }) => {
  const digits = otp.split("");
  const toast = useToast();
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    setSeconds(60);
    const interval = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otp]);

  const circumference = 2 * Math.PI * 24;
  const dash = useMemo(() => (seconds / 60) * circumference, [seconds, circumference]);

  const copyOTP = async () => {
    await navigator.clipboard.writeText(otp);
    toast("OTP copied to clipboard", "success");
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/40 p-4 text-center dark:bg-white/5">
      <div className="flex gap-2">
        {digits.map((digit, index) => (
          <motion.span
            key={`${digit}-${index}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.06 }}
            className="flex h-12 w-10 items-center justify-center rounded-xl bg-white/80 text-lg font-bold text-dark-navy shadow-sm dark:bg-dark-navy/80 dark:text-white"
          >
            {digit}
          </motion.span>
        ))}
      </div>
      <div className="relative h-14 w-14">
        <svg className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="28" cy="28" r="24" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
          <motion.circle
            cx="28"
            cy="28"
            r="24"
            stroke="#00E5C4"
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference - dash }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-600 dark:text-white">{seconds}s</span>
      </div>
      <button onClick={copyOTP} className="btn-primary text-xs">
        Copy OTP
      </button>
    </div>
  );
};

export default OTPGenerator;

