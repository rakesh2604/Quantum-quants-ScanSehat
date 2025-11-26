const patientPoints = ["Encrypt + upload in <30s", "Control TTL & revoke anytime", "See AI vitals + meds summary", "Audit which doctor accessed data"];
const doctorPoints = ["Redeem OTP / QR instantly", "View logs + AI synopsis", "Only ciphertext delivered", "Boost trust score via patient feedback"];

const CompareCards = () => (
  <div className="grid gap-6 md:grid-cols-2">
    <div className="glass border-primary/40">
      <h3 className="text-2xl font-semibold text-dark-navy dark:text-white">Patient Experience</h3>
      <p className="text-sm text-slate-500 dark:text-slate-300">Mobile-first, works with poor bandwidth, AI explains records in human terms.</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-200">
        {patientPoints.map((point) => (
          <li key={point} className="flex items-center gap-2">
            <span className="text-primary">•</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
    <div className="glass border-accent-purple/40">
      <h3 className="text-2xl font-semibold text-dark-navy dark:text-white">Doctor Experience</h3>
      <p className="text-sm text-slate-500 dark:text-slate-300">In-clinic portal with redemption timeline, trust score, and consent reminders.</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-200">
        {doctorPoints.map((point) => (
          <li key={point} className="flex items-center gap-2">
            <span className="text-accent-purple">•</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default CompareCards;

