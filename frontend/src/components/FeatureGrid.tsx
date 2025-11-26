import { motion } from "framer-motion";
import IconKey from "./IconKey";
import IconDocument from "./IconDocument";
import IconQR from "./IconQR";
import IconShield from "./IconShield";

const features = [
  { title: "Client-side AES", description: "Ciphertext + IV + salt stored per record. Keys never leave the patient.", icon: IconKey },
  { title: "AI OCR", description: "GPT-4o vision plus Tesseract fallback extracts vitals, meds, and follow-up tasks.", icon: IconDocument },
  { title: "Share via OTP / QR", description: "Push a temporary token to doctors with TTL controls and hashed OTP storage.", icon: IconQR },
  { title: "Audit-ready Logs", description: "Every doctor action appended to immutable AccessLog with timezone and facility.", icon: IconShield },
  { title: "Reputation Signals", description: "Doctor trust score based on access streaks, patient feedback, and revocations.", icon: IconShield },
  { title: "Edge Summaries", description: "Browser shows AI summary + risk flags before upload to reassure patients.", icon: IconDocument }
];

const FeatureGrid = () => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {features.map((feature, index) => (
      <motion.article
        key={feature.title}
        className="glass flex flex-col gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <feature.icon className="h-12 w-12 text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-dark-navy dark:text-white">{feature.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
        </div>
      </motion.article>
    ))}
  </div>
);

export default FeatureGrid;

