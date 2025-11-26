import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface CallToActionProps {
  title?: string;
  ctaText?: string;
  ctaLink?: string;
}

const CallToAction = ({ 
  title = "Start managing your health records the modern way.",
  ctaText = "Get Started",
  ctaLink = "/register"
}: CallToActionProps) => {
  return (
    <section className="w-full bg-gradient-to-br from-[#0C6CF2] via-[#008BDB] to-[#00A1A9] py-20 text-center text-white relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
      </div>
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            {title}
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={ctaLink}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0C6CF2] rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label={ctaText}
            >
              {ctaText}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;

