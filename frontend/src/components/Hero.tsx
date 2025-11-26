import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => (
  <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-night-sky via-dark-navy to-black px-6 py-20 text-white shadow-glow">
    <motion.div
      className="absolute inset-0 opacity-40"
      animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
      transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(0,229,196,0.45), transparent 45%), radial-gradient(circle at 80% 0%, rgba(139,92,246,0.4), transparent 50%)"
      }}
    />
    <div className="relative mx-auto max-w-5xl text-center">
      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-xs uppercase tracking-[0.4em] text-white/70">
        Scan Sehat · Multi-tenant SaaS for Federated EHR
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-6 text-4xl font-black leading-tight md:text-6xl"
      >
        Neon-fast patient vaults with AI triage, Google sign-on, and QR/OTP sharing in <span className="text-primary">60 seconds.</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="mx-auto mt-6 max-w-3xl text-lg text-white/80">
        Multi-tenant organisations spin up encrypted workspaces, doctors authenticate with Google, and neon dashboards reveal trends powered by Framer Motion micro-interactions.
      </motion.p>
      <motion.div className="mt-10 flex flex-wrap justify-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Link to="/register" className="btn-primary">
          Start Free
        </Link>
        <Link to="/pricing" className="btn-secondary">
          Explore Pricing
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-12 grid gap-4 text-left text-sm text-white/80 md:grid-cols-3"
      >
        {[
          "Google OAuth2 + email verification baked in",
          "Tenant aware audit trails with neon heatmaps",
          "Secure cookies, rotating sessions, Stripe-ready billing"
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Hero;

