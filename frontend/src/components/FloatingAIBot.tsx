import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const suggestions = [
  "Summarise MRI + flag anomalies",
  "Prep QR share for Dr. Menon",
  "Compare vitals across visits"
];

const cannedReplies = [
  { role: "bot", text: "Hi! I’m the Scan Sehat copilot. Ask me to prep a neon dashboard or craft a secure share link." },
  { role: "bot", text: "Tip: paste an OTP and I’ll validate it against hashed sessions before a doctor joins." }
];

const FloatingAIBot = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40">
      <motion.button
        aria-label="Open AI assistant demo"
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-dark-navy shadow-glow focus-ring"
        onClick={() => setOpen((prev) => !prev)}
        animate={{ scale: [1, 1.03, 1], boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 30px rgba(0,229,196,0.3)", "0 0 0 rgba(0,0,0,0)"] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      >
        <motion.span
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-dark-navy text-primary"
          animate={{ rotate: open ? 12 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          ✨
        </motion.span>
        Scan Sehat Copilot
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-auto mt-3 w-72 rounded-3xl border border-white/15 bg-white/95 p-4 text-sm text-slate-700 shadow-2xl dark:bg-night-sky/95 dark:text-white"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Demo Only</p>
            <div className="mt-3 space-y-3">
              {cannedReplies.map((reply) => (
                <motion.div key={reply.text} className="rounded-2xl bg-white/60 p-3 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-200">
                  {reply.text}
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-300">Quick prompts</p>
            <ul className="mt-2 space-y-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button className="w-full rounded-xl border border-white/20 bg-white/50 px-3 py-2 text-left text-xs text-dark-navy transition hover:border-primary hover:text-primary dark:bg-white/5 dark:text-white">
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl border border-dashed border-white/40 p-3 text-xs text-slate-500 dark:text-slate-300">
              Coming soon: real-time doc chat, retrieval augmentations, and compliance log export.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingAIBot;

