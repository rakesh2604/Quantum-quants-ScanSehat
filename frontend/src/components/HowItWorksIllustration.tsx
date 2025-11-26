import { motion } from "framer-motion";

const nodes = [
  { label: "Device (Encrypt)", color: "from-primary/70 to-primary", translate: "0,0" },
  { label: "Quantum Cloud (Encrypted)", color: "from-slate-700 to-dark-navy", translate: "120,40" },
  { label: "Doctor (OTP/QR)", color: "from-accent-purple/80 to-accent-purple", translate: "240,0" },
  { label: "Audit Log", color: "from-emerald-500/70 to-emerald-500", translate: "120,-60" }
];

const HowItWorksIllustration = () => (
  <svg viewBox="0 0 360 180" className="w-full" role="img" aria-label="How encrypted sharing works">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#0FB9B1" />
      </marker>
    </defs>
    {nodes.map((node, index) => {
      const [x, y] = node.translate.split(",");
      return (
        <motion.g key={node.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
          <rect
            x={Number(x) + 40}
            y={Number(y) + 60}
            width="100"
            height="50"
            rx="15"
            className={`fill-[url(#grad-${index})]`}
          />
          <text x={Number(x) + 90} y={Number(y) + 90} textAnchor="middle" fill="white" fontSize="11">
            {node.label}
          </text>
        </motion.g>
      );
    })}
    <defs>
      {nodes.map((node, index) => (
        <linearGradient key={node.label} id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={node.color.split(" ")[0].split("/")[1] ? "#0FB9B1" : "#8B5CF6"} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#071029" stopOpacity="0.8" />
        </linearGradient>
      ))}
    </defs>
    <motion.line x1="90" y1="85" x2="180" y2="105" stroke="#0FB9B1" strokeWidth="3" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} />
    <motion.line x1="220" y1="105" x2="310" y2="85" stroke="#8B5CF6" strokeWidth="3" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} />
    <motion.line x1="180" y1="105" x2="220" y2="45" stroke="#22c55e" strokeWidth="3" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} />
  </svg>
);

export default HowItWorksIllustration;

