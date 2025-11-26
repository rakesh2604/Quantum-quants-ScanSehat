// Icons auto-generated and wired by Cursor: health-icons/*.svg
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Shield, FileText, Share2, Lock, Database, Zap } from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import CallToAction from "../components/CallToAction";
import HeroSlider from "../components/HeroSlider";
import PremiumCard from "../components/PremiumCard";

const Home = () => {
  const { scrollYProgress } = useScroll();

  // Validate images on mount
  useEffect(() => {
    const requiredImages = [
      "/ehr_dashboard_preview.png",
      "/health_overview_dashboard.png",
      "/mobile_doctor_app_mockup.png",
      "/hospital_ui_kit_preview.png",
      "/meditrack_patient_record.png",
      "/gertrudes_hybrid_records.png",
      "/medicore_hospital_table.png",
      "/zendenta_patient_record.png",
    ];
    requiredImages.forEach((img) => {
      const imgEl = new Image();
      imgEl.onerror = () => console.warn(`IMAGE MISSING: ${img}`);
      imgEl.src = img;
    });
  }, []);

  // Hero images for slider
  const heroImages = [
    "/ehr_dashboard_preview.png",
    "/health_overview_dashboard.png",
    "/mobile_doctor_app_mockup.png",
  ];

  // Problem cards - 6 required cards
  const problemCards = [
    {
      icon: "/health-icons/medical-history.svg",
      title: "Lost Medical History",
      description: "Medical records scattered across hospitals, making it difficult to access complete health history.",
      gradient: "from-[#E0F2FE] to-[#F0F9FF]",
    },
    {
      icon: "/health-icons/lab-test.svg",
      title: "Repeated Tests",
      description: "Patients undergo redundant medical tests because previous results are not accessible.",
      gradient: "from-[#FEF3C7] to-[#FDE68A]",
    },
    {
      icon: "/health-icons/diagnosis.svg",
      title: "Misdiagnosis Risk",
      description: "Incomplete medical information increases the risk of misdiagnosis and improper treatment.",
      gradient: "from-[#FEE2E2] to-[#FECACA]",
    },
    {
      icon: "/health-icons/database.svg",
      title: "Centralized EHR Vault",
      description: "All medical records stored securely in one place, accessible anytime, anywhere.",
      gradient: "from-[#DBEAFE] to-[#BFDBFE]",
    },
    {
      icon: "/health-icons/qr-code.svg",
      title: "Instant Sharing with QR/OTP",
      description: "Share medical records instantly with healthcare providers using secure QR codes or OTP.",
      gradient: "from-[#D1FAE5] to-[#A7F3D0]",
    },
    {
      icon: "/health-icons/ai.svg",
      title: "Structured AI Medical Extraction",
      description: "AI-powered extraction organizes medical documents into structured, searchable formats.",
      gradient: "from-[#E9D5FF] to-[#DDD6FE]",
    },
  ];

  // Medical interface gallery images
  const medicalInterfaceImages = [
    "/ehr_dashboard_preview.png",
    "/health_overview_dashboard.png",
    "/mobile_doctor_app_mockup.png",
    "/hospital_ui_kit_preview.png",
    "/meditrack_patient_record.png",
    "/gertrudes_hybrid_records.png",
  ];

  // Premium features
  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "AES-256 encrypted storage ensures your medical data remains private and secure with enterprise-grade security.",
      iconColor: "#0C6CF2",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: FileText,
      title: "Portable Records",
      description: "Carry your complete medical history across hospitals for seamless continuity of care anywhere in the world.",
      iconColor: "#00A1A9",
      bgGradient: "from-teal-50 to-emerald-50",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Grant temporary access to healthcare providers via QR codes or OTP with full audit trail and permissions.",
      iconColor: "#0C6CF2",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Your data is encrypted at rest and in transit, ensuring maximum privacy and compliance with healthcare regulations.",
      iconColor: "#8B5CF6",
      bgGradient: "from-purple-50 to-violet-50",
    },
    {
      icon: Database,
      title: "AI-Powered Organization",
      description: "Intelligent document extraction and categorization makes your medical records instantly searchable and organized.",
      iconColor: "#00A1A9",
      bgGradient: "from-teal-50 to-cyan-50",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Access your complete medical history in seconds with our optimized cloud infrastructure and smart caching.",
      iconColor: "#F59E0B",
      bgGradient: "from-amber-50 to-yellow-50",
    },
  ];

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const galleryY = useTransform(scrollYProgress, [0.2, 0.8], [0, -100]);

  // Letter animation for headline
  const headline = "Your Health Records, Under Your Control";
  const headlineWords = headline.split(" ");

  return (
    <div className="bg-gradient-to-b from-white to-[#F7FBFF] overflow-hidden">
      {/* Section 1 — PREMIUM HERO WITH MULTI-IMAGE SLIDER */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Floating gradient blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 floating-shape bg-[#0C6CF2]"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-80 h-80 floating-shape bg-[#00A1A9]"
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-72 h-72 floating-shape bg-[#0C6CF2]"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-32 flex flex-col md:flex-row items-center md:justify-between gap-20 relative z-10">
          {/* Left: Headline & CTAs */}
          <motion.div
            style={{ y: heroY }}
            className="flex-1 w-full md:w-auto text-center md:text-left max-w-[600px] md:flex md:flex-col md:justify-center"
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.4em] text-[#0C6CF2] font-semibold mb-4"
            >
              Premium Medical SaaS Platform
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-tight"
            >
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="inline-block mr-2"
                >
                  {word === "Control" ? (
                    <span className="text-[#0C6CF2]">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto md:mx-0"
            >
              Scan Sehat provides a secure, portable Electronic Health Record system where patients control their data with AI-powered organization and instant sharing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button to="/register" variant="primary" ariaLabel="Get Started">
                  Get Started Free
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button to="/login" variant="outline" ariaLabel="Launch App">
                  Launch App
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Image Slider */}
          <motion.div
            style={{ y: heroY }}
            className="flex-1 w-full md:w-auto relative"
          >
            <div className="mx-auto w-full flex justify-center">
              <div className="relative w-full max-w-[600px] h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0C6CF2]/20 to-[#00A1A9]/20 rounded-3xl blur-3xl -z-10" />
                <HeroSlider images={heroImages} autoScrollInterval={4000} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — "The Problem We Solve" (REBUILT WITH PREMIUM CARDS) */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-8 py-32 bg-white overflow-hidden">
        {/* Floating gradient blobs */}
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 floating-shape bg-[#0C6CF2]"
          animate={{
            y: [0, -15, 0],
            opacity: [0.16, 0.2, 0.16],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-96 h-96 floating-shape bg-[#00A1A9]"
          animate={{
            y: [0, 15, 0],
            opacity: [0.16, 0.2, 0.16],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <SectionTitle title="The Problem We Solve" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-16">
            {problemCards.map((card, index) => (
              <PremiumCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
                gradient={card.gradient}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — "Modern Medical Interfaces" (NEW SECTION) */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-8 py-32 overflow-hidden">
        <motion.div
          style={{ y: galleryY }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionTitle
              title="Modern Medical Interfaces"
              subtitle="Experience our premium dashboard designs and user interfaces"
            />
          </motion.div>

          <div className="mt-16 relative">
            {/* Auto-sliding gallery with parallax */}
            <div className="overflow-hidden rounded-2xl">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [`-${(medicalInterfaceImages.length - 1) * 33.333}%`, "0%"],
                }}
                transition={{
                  duration: medicalInterfaceImages.length * 5,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
              >
                {/* Duplicate images for seamless loop */}
                {[...medicalInterfaceImages, ...medicalInterfaceImages].map((img, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
                    whileHover={{
                      rotateZ: -1,
                      scale: 1.05,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <div className="relative group px-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0C6CF2]/10 to-[#00A1A9]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                        <img
                          src={img}
                          alt={`Medical UI Example ${(index % medicalInterfaceImages.length) + 1}`}
                          className="w-full h-auto object-cover"
                          onError={() => {
                            console.warn(`IMAGE MISSING: ${img}`);
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4">
                          <p className="text-white font-semibold text-sm">
                            Medical UI Example #{(index % medicalInterfaceImages.length) + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating blobs */}
        <motion.div
          className="absolute top-10 right-10 w-72 h-72 floating-shape bg-[#0C6CF2]"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-64 h-64 floating-shape bg-[#00A1A9]"
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </section>

      {/* Section 4 — "Key Features" (UPGRADED TO PREMIUM SAAS STYLE) */}
      <section className="relative w-full bg-gradient-to-b from-white to-[#F7FBFF] py-32 overflow-hidden">
        {/* Floating gradient blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 floating-shape bg-[#0C6CF2]"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 floating-shape bg-[#00A1A9]"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionTitle
              title="Key Features"
              subtitle="Everything you need for secure, portable health records"
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-16"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6 },
                    },
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  className="relative glass-card rounded-2xl p-8 border border-white/20 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all duration-300 group"
                >
                  {/* Radial gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl opacity-40 blur-2xl -z-10 group-hover:opacity-60 transition-opacity duration-300`} />

                  {/* Icon badge with breathing animation */}
                  <motion.div
                    animate={{
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-6 shadow-lg border border-white/50 mx-auto md:mx-0`}
                  >
                    <Icon className="h-10 w-10" style={{ color: feature.iconColor }} />
                  </motion.div>

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center md:text-left">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed text-center md:text-left">
                    {feature.description}
                  </p>

                  {/* Shimmer overlay on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <CallToAction />
    </div>
  );
};

export default Home;
