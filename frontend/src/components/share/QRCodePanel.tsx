import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface QRCodePanelProps {
  qrValue: string;
  expiresAt?: Date;
  onDownload?: () => void;
}

const QRCodePanel = ({ qrValue, expiresAt, onDownload }: QRCodePanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue);
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
      <h3 className="text-section-header-lg text-text-dark dark:text-text-light mb-4 font-semibold">
        Share via QR Code
      </h3>
      
      <div className="flex justify-center mb-6">
        <div className="relative p-4 bg-white rounded-xl shadow-medical">
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
            className="animate-fade-in"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/10 rounded-xl pointer-events-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 p-3 bg-background-light dark:bg-card-dark rounded-lg">
          <code className="text-body font-mono text-text-dark dark:text-text-light break-all">{qrValue}</code>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-primary-light dark:hover:bg-primary/10 transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-success" />
            ) : (
              <Copy className="w-5 h-5 text-text-secondary" />
            )}
          </button>
        </div>

        {expiresAt && (
          <p className="text-label text-text-secondary">
            Expires: {expiresAt.toLocaleString()}
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onDownload}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download QR
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default QRCodePanel;

