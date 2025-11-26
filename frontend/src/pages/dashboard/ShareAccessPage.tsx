import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, QrCode, Key, Send, Share2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import QRCodePanel from "../../components/share/QRCodePanel";
import OTPPanel from "../../components/share/OTPPanel";
import Modal from "../../components/Modal";
import { useToast } from "../../components/Toast";
import { accessApi } from "../../utils/api";
import clsx from "clsx";

const ShareAccessPage = () => {
  const [doctorEmail, setDoctorEmail] = useState("");
  const [channel, setChannel] = useState<"otp" | "qr">("otp");
  const [modalOpen, setModalOpen] = useState(false);
  const [packet, setPacket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleGenerate = async () => {
    if (!doctorEmail) {
      toast("Please enter doctor's email", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await accessApi.shareAccess({ doctorEmail, channel });
      setPacket({ ...data, doctorEmail });
      setModalOpen(true);
      toast("Secure access session created", "success");
    } catch (error: any) {
      toast(error?.response?.data?.message ?? "Unable to create access session", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-6 h-6 text-[#0C6CF2]" />
              <h1 className="text-3xl font-bold text-gray-900">
                Share Access
              </h1>
            </div>
            <p className="text-[15px] text-gray-600">
              Grant temporary access to your medical records via secure OTP or QR code
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 space-y-6 hover:shadow-lg transition-shadow"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Grant Doctor Access
              </h2>
              <p className="text-[15px] text-gray-600">
                Generate a secure OTP or QR code to share your medical records with a doctor. Access expires automatically after the set time.
              </p>
            </div>

            {/* Doctor Email Input */}
            <div>
              <label className="block text-[14px] font-medium text-gray-900 mb-2">
                Doctor's Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  placeholder="doctor@hospital.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-[#F7F9FB] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent text-[15px]"
                  required
                />
              </div>
            </div>

            {/* Channel Selection */}
            <div>
              <label className="block text-[14px] font-medium text-gray-900 mb-3">
                Share Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setChannel("otp")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    "p-6 rounded-xl border-2 transition-all duration-200 text-left",
                    channel === "otp"
                      ? "border-[#0C6CF2] bg-blue-50"
                      : "border-gray-200 hover:border-[#0C6CF2]/50 bg-white"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={clsx(
                      "p-2 rounded-lg",
                      channel === "otp" ? "bg-[#0C6CF2] text-white" : "bg-[#F7F9FB] text-gray-600"
                    )}>
                      <Key className="w-5 h-5" />
                    </div>
                    <span className={clsx(
                      "text-[16px] font-semibold",
                      channel === "otp" ? "text-[#0C6CF2]" : "text-gray-900"
                    )}>
                      OTP Code
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-600">
                    Share a one-time password that expires after use
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => setChannel("qr")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    "p-6 rounded-xl border-2 transition-all duration-200 text-left",
                    channel === "qr"
                      ? "border-[#0C6CF2] bg-blue-50"
                      : "border-gray-200 hover:border-[#0C6CF2]/50 bg-white"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={clsx(
                      "p-2 rounded-lg",
                      channel === "qr" ? "bg-[#0C6CF2] text-white" : "bg-[#F7F9FB] text-gray-600"
                    )}>
                      <QrCode className="w-5 h-5" />
                    </div>
                    <span className={clsx(
                      "text-[16px] font-semibold",
                      channel === "qr" ? "text-[#0C6CF2]" : "text-gray-900"
                    )}>
                      QR Code
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-600">
                    Generate a scannable QR code for quick access
                  </p>
                </motion.button>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={loading || !doctorEmail}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full px-6 py-3 bg-[#0C6CF2] hover:bg-[#0A5CD9] text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate {channel === "otp" ? "OTP" : "QR Code"}
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Modal for Generated Access */}
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <AnimatePresence mode="wait">
              {packet && (
                <motion.div
                  key={channel}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {channel === "otp" && packet.otp && (
                    <OTPPanel
                      otp={packet.otp}
                      expiresAt={packet.expiresAt ? new Date(packet.expiresAt) : undefined}
                      onRegenerate={() => handleGenerate()}
                    />
                  )}
                  {channel === "qr" && (packet.qr || packet.qrPayload) && (
                    <QRCodePanel
                      qrValue={packet.qrPayload || packet.qr || ""}
                      expiresAt={packet.expiresAt ? new Date(packet.expiresAt) : undefined}
                      onDownload={() => {
                        toast("QR code download feature coming soon", "info");
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Modal>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ShareAccessPage;

