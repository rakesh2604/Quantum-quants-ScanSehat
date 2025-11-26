import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { authApi } from "../utils/api";
import { useToast } from "../components/Toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      toast("If the account exists, reset instructions were emailed.", "success");
    } catch {
      toast("Unable to trigger reset flow", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F7FBFF] overflow-hidden relative">
      {/* Floating gradient blobs - 3 different sizes */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 floating-shape bg-[#0C6CF2]"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-80 h-80 floating-shape bg-[#00A1A9]"
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-72 h-72 floating-shape bg-[#0C6CF2]"
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 min-h-screen flex items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="glass-card rounded-3xl p-8 md:p-10 shadow-card border border-white/20 backdrop-blur-xl bg-white/30"
          >
            <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0C6CF2] transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to login</span>
            </Link>

            {/* Healthcare Icon Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0C6CF2] to-[#00A1A9] flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Mail className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="text-3xl md:text-4xl font-black text-gray-900 mb-2"
              >
                Reset Password
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="text-gray-600"
              >
                We'll send a secure link valid for 15 minutes to reset your password.
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              >
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0C6CF2] to-[#00A1A9] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
