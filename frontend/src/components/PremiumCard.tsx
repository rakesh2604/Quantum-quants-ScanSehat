import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PremiumCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  index: number;
}

const PremiumCard = ({ icon, title, description, gradient, index }: PremiumCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ 
        scale: 1.04, 
        rotate: -1, 
        y: -6,
        transition: { duration: 0.3 }
      }}
      className="glass-card rounded-3xl p-8 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.1)] transition-all duration-300 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl"
    >
      <div className="relative">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-30 blur-xl -z-10`} />
        
        {/* Icon container */}
        <div className="relative mb-6">
          <motion.div
            animate={{ 
              opacity: [1, 0.7, 1],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-lg border border-white/60 mx-auto"
          >
            <img
              src={icon}
              alt={title}
              className="w-12 h-12 object-contain"
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {title}
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumCard;

