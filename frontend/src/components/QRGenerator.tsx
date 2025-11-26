import { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

type QRGeneratorProps = {
  token: string;
  doctor?: string;
};

const QRGenerator = ({ token, doctor }: QRGeneratorProps) => {
  const value = useMemo(() => JSON.stringify({ token, doctor, issuedAt: Date.now() }), [token, doctor]);
  return (
    <motion.div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/40 p-4 text-center dark:bg-white/5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <QRCodeCanvas value={value} size={180} fgColor="#00E5C4" bgColor="transparent" includeMargin />
      <p className="text-xs text-slate-600 dark:text-slate-300">Scan within 60 seconds to initiate session.</p>
    </motion.div>
  );
};

export default QRGenerator;

