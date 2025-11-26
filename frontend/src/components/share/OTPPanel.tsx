import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";

interface OTPPanelProps {
  otp: string;
  expiresAt?: Date;
  onRegenerate?: () => void;
}

const OTPPanel = ({ otp, expiresAt, onRegenerate }: OTPPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="medical-card p-8 text-center"
    >
      <h3 className="text-section-header-lg text-text-dark dark:text-text-light mb-6 font-semibold">
        Share via OTP
      </h3>

      <div className="flex justify-center gap-2 mb-6">
        {otp.split("").map((digit, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            className="w-14 h-16 flex items-center justify-center text-title-lg font-bold bg-background-light dark:bg-card-dark border-2 border-primary rounded-lg text-primary"
          >
            {digit}
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 p-3 bg-background-light dark:bg-card-dark rounded-lg">
          <code className="text-body font-mono text-text-dark dark:text-text-light">{otp}</code>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-primary-light dark:hover:bg-primary/10 transition-colors"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-5 h-5 text-success" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-5 h-5 text-text-secondary" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {expiresAt && (
          <p className="text-label text-text-secondary">
            Expires: {expiresAt.toLocaleString()}
          </p>
        )}

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="btn-secondary flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate OTP
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default OTPPanel;

